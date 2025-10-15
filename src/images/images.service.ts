import { Injectable } from '@nestjs/common';

@Injectable()
export class ImageProcessingService {
    apply(): boolean {
        throw new Error('Method not implemented.');
    }
    getOne(id: number, userId: number): Promise<{ id: number, image_link: string }> {
        throw new Error('Method not implemented.');
    }
    getAll(): Promise<{ id: number, image_link: string }[]> {
        throw new Error('Method not implemented.');
    }
    upload(file: Express.Multer.File): Promise<{ id: number, image_link: string }> {
        // Save the file in AWS S3
        // Get the object's url
        // Store the url in db
        // Return { id: number, url: string }
        throw new Error('Method not implemented.');
    }
}