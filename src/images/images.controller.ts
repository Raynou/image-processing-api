import {
  Controller,
  Get,
  Param,
  Post,
  Put,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ImageProcessingService } from './images.service';
import { AuthGuard } from '../auth/auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import type { Request } from 'express';

@Controller('image')
@UseGuards(AuthGuard)
export class ImageProcessingController {
  constructor(
    private readonly imageProcessingService: ImageProcessingService,
  ) {}

  @Get(':id')
  retrieveImage(@Param('id') id: string, @Req() request: Request) {
    return this.imageProcessingService.getOne(Number(id), request['user'].sub);
  }

  @Get()
  listImages(@Req() request: Request) {
    /**
     * Get information from the JWT to retrieve the user images.
     */
    return this.imageProcessingService.getAll();
  }

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  uploadImage(
    @UploadedFile() file: Express.Multer.File,
    @Req() request: Request,
  ) {
    // This must receive an image
    /**
     * We're using the following doc: https://docs.nestjs.com/techniques/file-upload as
     * a reference to build this endpoint.
     */
    return this.imageProcessingService.upload(file);
  }

  @Put('transform/:id')
  transformImage(@Param('id') id: string, @Req() request: Request) {
    // Return metadata
    return this.imageProcessingService.apply();
  }
}
