import {
  Body,
  Controller,
  FileTypeValidator,
  Get,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  Post,
  Put,
  Req,
  StreamableFile,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ImagesService } from './services/images.service';
import { AuthGuard } from '../auth/auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import type { Request } from 'express';
import { TransformationsDTO } from './dto/transformations.dto';

@Controller('image')
@UseGuards(AuthGuard)
export class ImagesController {
  constructor(private readonly imagesService: ImagesService) {}

  @Get(':id')
  retrieveImage(@Param('id') id: string /* Use a pipeline here */, @Req() request: Request) {
    return this.imagesService.getOne(Number(id), request);
  }

  @Get()
  listImages(@Req() request: Request) {
    return this.imagesService.getAll(request);
  }

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  uploadImage(
    @UploadedFile(
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
    @Body() body: TransformationsDTO,
    @Param('id') id: string, // Use a pipeline here
    @Req() request: Request,
    @UploadedFile()
    watermarkFile?: Express.Multer.File, // Create a custom pipeline to validate file format: https://claude.ai/chat/f47babad-7c21-424e-a310-a5ed1b16bb4e
  ): Promise<StreamableFile> {
    return new StreamableFile(
      await this.imagesService.apply(body, id, request, watermarkFile),
    );
  }
}
