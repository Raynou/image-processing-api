import {
  PipeTransform,
  Injectable,
  BadRequestException,
} from '@nestjs/common';

@Injectable()
export class RequiredFilePipe implements PipeTransform {
  transform(file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException(
        `Missing file. Make sure your form field name is "file"`,
      );
    }
    return file;
  }
}
