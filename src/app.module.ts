import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ImageProcessingModule } from './image-processing/image-processing.module';
import { PrismaModule } from './prisma/prisma.module';
import { CryptModule } from './crypt/crypt.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [AuthModule, ImageProcessingModule, PrismaModule, CryptModule, UserModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
