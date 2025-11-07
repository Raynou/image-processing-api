import {
  PipeTransform,
  Injectable,
  BadRequestException,
  ArgumentMetadata,
} from '@nestjs/common';

@Injectable()
export class OptionalFilePipe implements PipeTransform {
  constructor(
    private readonly maxSize: number,
    private readonly allowedTypes: RegExp,
  ) {}

  transform(file?: Express.Multer.File) {
    if (!file) {
      return undefined;
    }

    // Validate size
    if (file.size > this.maxSize) {
      throw new BadRequestException(
        `File size exceeds maximum allowed size of ${this.maxSize} bytes`,
      );
    }

    // Validate type
    if (!this.allowedTypes.test(file.mimetype)) {
      throw new BadRequestException(
        `Invalid file type. Only JPEG, JPG, and PNG are allowed`,
      );
    }
  }
}
