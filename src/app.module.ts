import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ImageProcessingModule } from './image-processing/image-processing.module';

@Module({
  imports: [AuthModule, ImageProcessingModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
