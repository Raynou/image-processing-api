import { Controller, Get, Post, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { ImageProcessingService } from './image-processing.service';
import { AuthGuard } from '../auth/auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('image')
@UseGuards(AuthGuard)
export class ImageProcessingController {
    constructor(private readonly imageProcessingService: ImageProcessingService) { }

    @Get()
    retrieveImage(id: number): string { // This must retrieve an image
        return this.imageProcessingService.get(id);
    }
    @Get()
    listImages(): string[] { // Retrieve a JSON with images links
        return this.imageProcessingService.getAll();
    }
    @Post()
    @UseInterceptors(FileInterceptor('file'))
    uploadImage(@UploadedFile() file: Express.Multer.File): string { // This must receive an image
        /**
        * We're using the following doc: https://docs.nestjs.com/techniques/file-upload as
        * a reference to build this endpoint.
        */
        return this.imageProcessingService.upload(file);
    }
    @Post('transform')
    transformImage(): boolean { // This must receive a list of transformations
        return this.imageProcessingService.apply();
    }
}