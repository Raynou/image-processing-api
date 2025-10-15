import { Module } from '@nestjs/common';
import { ImageProcessingController } from './images.controller';
import { ImageProcessingService } from './images.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [ImageProcessingController],
  providers: [ImageProcessingService],
})
export class ImagesModule {}
