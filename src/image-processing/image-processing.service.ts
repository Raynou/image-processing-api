import { Injectable } from '@nestjs/common';

/**
 * There's the `merequetengue`
 */

interface iImageProcessingService {
    get(id: number): string,
    getAll(): [string],
    upload(): string,
    apply(): boolean
}

@Injectable()
export class ImageProcessingService implements iImageProcessingService {
    apply(): boolean {
        throw new Error('Method not implemented.');
    }
    get(id: number): string {
        throw new Error('Method not implemented.');
    }
    getAll(): [string] {
        throw new Error('Method not implemented.');
    }
    upload(): string {
        throw new Error('Method not implemented.');
    }
}