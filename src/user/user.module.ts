import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { CryptModule } from '../crypt/crypt.module';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
    imports: [CryptModule, PrismaModule],
    providers: [UserService],
    exports: [UserService]
})

export class UserModule {}