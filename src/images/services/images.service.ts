import {
  Injectable,
  NotImplementedException,
  Req,
} from '@nestjs/common';
import { TransformationsDTO } from '../dto/transformations.dto';
import { ImageDTO } from '../dto/image.dto';
import type { Request } from 'express';
import { PrismaService } from '../../prisma/prisma.service';
import { ProcessingService } from './processing.service';
import { CloudStorageService } from './cloud-storage.service';
import { ImageNotFoundException } from '../exceptions/image-not-found.exception';

type TransformationHandler = (
  image: Uint8Array,
  params: any,
) => Promise<Uint8Array>;

@Injectable()
export class ImagesService {
  constructor(
    private readonly cloudStorageService: CloudStorageService,
    private readonly processingService: ProcessingService,
    private readonly prisma: PrismaService,
  ) {}

  private readonly transformationHandlers: Record<
    string,
    TransformationHandler
  > = {
    resize: (img, params) => this.processingService.resize(img, params),
    crop: (img, params) => this.processingService.crop(img, params),
    rotate: (img, params) => this.processingService.rotate(img, params),
    filters: (img, params) => this.processingService.filters(img, params),
    mirror: (img, _params) => this.processingService.mirror(img),
    compress: (img, params) => this.processingService.compress(img, params),
    watermark: (img, params) =>
      this.processingService.applyWatermark(img, params),
    upscale: (img, params) => this.processingService.aiUpScale(img, params),
  };

  async apply(
    transformationsDTO: TransformationsDTO,
    imageId: number,
    @Req() request: Request,
    watermarkFile?: Express.Multer.File,
  ): Promise<{ image: Uint8Array<ArrayBufferLike>; format: string }> {
    // Maybe it'd be convenient to store the modified image in S3
    const { transformations } = transformationsDTO;
    const requestUserId: number = request['user'].subject;
    const imageWithOwner = await this.prisma.image.findUnique({
      where: { id: imageId, ownerId: requestUserId },
    });

    if (!imageWithOwner) {
      throw new ImageNotFoundException(`Image with id: ${imageId} was not found`);
    }

    if (watermarkFile && transformations.watermark?.type === 'image') {
      transformations.watermark.image = watermarkFile.buffer;
    }

    let image = await this.cloudStorageService.getImage(imageWithOwner.key);

    for (const [operation, params] of Object.entries(transformations)) {
      const handler = this.transformationHandlers[operation];

      if (handler && params !== undefined && params !== null) {
        image = await handler(image, params);
      }
    }

    const format = await this.processingService.getFormat(image);
    return { image, format };
  }

  async getOne(id: number, @Req() request: Request): Promise<ImageDTO> {
    const ownerId: number = request['user'].subject;
    const image = await this.prisma.image.findUnique({
      where: { id, ownerId },
    });
    if (!image) {
      throw new ImageNotFoundException(`Image with id: ${id} was not found`);
    }
    return { id: image.id, key: image.key };
  }

  async getAll(@Req() request: Request): Promise<ImageDTO[]> {
    const ownerId: number = request['user'].subject;
    return (
      await this.prisma.image.findMany({
        where: { ownerId },
      })
    ).map((image) => {
      return { id: image.id, key: image.key };
    });
  }

  async download(id: number, @Req() request: Request) {
    throw new NotImplementedException();
  }

  async upload(
    file: Express.Multer.File,
    @Req() request: Request,
  ): Promise<ImageDTO> {
    const userId: number = request['user'].sub;

    const key = `key-${Date.now()}-${Math.random()}`;

    try {
      this.cloudStorageService.uploadImage(key, file.buffer);
    } catch (uploadError) {
      throw new Error(
        `Failed to upload S3: ${uploadError instanceof Error ? uploadError.message : 'Unknown Error'}`,
      );
    }

    try {
      const image = await this.prisma.image.create({
        data: { ownerId: userId, key: key },
      });
      return { id: image.id, key: key } as ImageDTO;
    } catch (error) {
      try {
        await this.cloudStorageService.deleteImage(key);
      } catch (deleteError) {
        console.error('Failed to cleanup S3 object: ', deleteError);
      }
      throw new Error(
        `Failed to save image metadata: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    }
  }
}
