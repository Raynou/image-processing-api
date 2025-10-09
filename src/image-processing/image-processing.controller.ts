import { Controller, Get, Post } from '@nestjs/common';
import { ImageProcessingService } from './image-processing.service';

@Controller()
export class ImageProcessingController {
    constructor(private readonly imageProcessingService: ImageProcessingService) {}

    @Get()
    retrieveImage(id: number): string { // This must retrieve an image
        return this.imageProcessingService.get(id);
    }

    @Get()
    listImages(): [string] { // Retrieve a JSON with images links
        return this.imageProcessingService.getAll();
    }

    @Post()
    uploadImage(): string { // This must receive an image
        return this.imageProcessingService.upload();
    }

    @Post()
    transformImage(): boolean { // This must receive a list of transformations
        return this.imageProcessingService.apply();
    }

}