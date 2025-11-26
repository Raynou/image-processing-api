import {
  Body,
  Controller,
  FileTypeValidator,
  Get,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  ParseIntPipe,
  Post,
  Put,
  Req,
  StreamableFile,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  BadRequestException,
} from '@nestjs/common';
import { ImagesService } from './services/images.service';
import { AuthGuard } from '../auth/auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import type { Request } from 'express';
import { TransformationsDTO } from './dto/transformations.dto';
import { OptionalFilePipe } from './pipes/optional-file.pipe';
import { RequiredFilePipe } from './pipes/required-file.pipe';
import { ParseBodyTypesPipe } from './pipes/parse-body-types.pipe';

@Controller('image')
@UseGuards(AuthGuard)
export class ImagesController {
  constructor(private readonly imagesService: ImagesService) {}

  @Get(':id')
  retrieveImage(
    @Param('id', ParseIntPipe) id: number,
    @Req() request: Request,
  ) {
    return this.imagesService.getOne(id, request);
  }

  @Get()
  listImages(@Req() request: Request) {
    return this.imagesService.getAll(request);
  }

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  uploadImage(
    @UploadedFile(
      new RequiredFilePipe(),
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 500_000 }),
          new FileTypeValidator({ fileType: /image\/(jpeg|jpg|png)/ }),
        ],
      }),
    )
    file: Express.Multer.File,
    @Req() request: Request,
  ) {
    return this.imagesService.upload(file, request);
  }

  @Put('transform/:id')
  @UseInterceptors(FileInterceptor('file'))
  async transformImage(
    @Body(ParseBodyTypesPipe) body: TransformationsDTO,
    @Param('id', ParseIntPipe) id: number,
    @Req() request: Request,
    @UploadedFile(new OptionalFilePipe(500_000, /image\/(jpeg|jpg|png)/))
    watermarkFile?: Express.Multer.File,
  ): Promise<StreamableFile> {
    if (body.transformations.watermark?.type === 'image' && !watermarkFile) {
      /**
       * FIXME:
       * This doesn't fit well with the error messages of class validator.
       */
      throw new BadRequestException('Image for watermark not provided');
    }

    const { image, format } = await this.imagesService.apply(
      body,
      id,
      request,
      watermarkFile,
    );

    const mimeMap: Record<string, string> = {
      jpeg: 'image/jpeg',
      jpg: 'image/jpg',
      png: 'image/png',
    };

    return new StreamableFile(image, {
      type: mimeMap[format],
      disposition: 'inline',
    });
  }
}
