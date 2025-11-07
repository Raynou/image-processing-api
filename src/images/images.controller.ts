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
} from '@nestjs/common';
import { ImagesService } from './services/images.service';
import { AuthGuard } from '../auth/auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import type { Request } from 'express';
import { TransformationsDTO } from './dto/transformations.dto';
import { OptionalFilePipe } from './pipelines/optional-file.pipeline';

@Controller('image')
@UseGuards(AuthGuard)
export class ImagesController {
  constructor(private readonly imagesService: ImagesService) {}

  @Get(':id')
  retrieveImage(@Param('id', ParseIntPipe) id: number, @Req() request: Request) {
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
    @Param('id', ParseIntPipe) id: number,
    @Req() request: Request,
    @UploadedFile(
      new OptionalFilePipe(500_000, /image\/(jpeg|jpg|png)/)
    )
    watermarkFile?: Express.Multer.File,
  ): Promise<StreamableFile> {
    return new StreamableFile(
      await this.imagesService.apply(body, id, request, watermarkFile),
    );
  }
}
