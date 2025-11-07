import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './services/auth.service';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './constants';
import { AuthGuard } from './auth.guard';
import { CryptService } from './services/crypt.service';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '30m' },
    }),
    PrismaModule
  ],
  controllers: [AuthController],
  providers: [AuthService, AuthGuard, CryptService],
  exports: [AuthService],
})
export class AuthModule {}
