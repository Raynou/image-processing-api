import { Module } from '@nestjs/common';
import { ImagesController } from './images.controller';
import { ImagesService } from './services/images.service';
import { AuthModule } from '../auth/auth.module';
import { ProcessingService } from './services/processing.service';
import { CloudStorageService } from './services/cloud-storage.service';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [AuthModule, PrismaModule],
  controllers: [ImagesController],
  providers: [ImagesService, ProcessingService, CloudStorageService],
})
export class ImagesModule {}
