import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './services/auth.service';
import { JwtModule } from '@nestjs/jwt';
import { AuthGuard } from './auth.guard';
import { CryptService } from './services/crypt.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    JwtModule.registerAsync({
      global: true,
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '30m' }
      }),
      inject: [ConfigService]
    }),
    PrismaModule
  ],
  controllers: [AuthController],
  providers: [AuthService, AuthGuard, CryptService],
  exports: [AuthService],
})
export class AuthModule {}
