import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { ImagesModule } from './images/images.module';

@Module({
  imports: [AuthModule, ImagesModule, PrismaModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
