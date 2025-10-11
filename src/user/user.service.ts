import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { User } from 'generated/prisma';
import { UserAlreadyExistsException } from './exception/user-already-exists.exception';
import { InvalidFieldValueException } from './exception/invalid-field-value.exception';
import { CryptService } from '../crypt/crypt.service';

@Injectable()
export class UserService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly cryptService: CryptService
    ) { }

    async insertOne(username: string, password: string): Promise<User> {
        if (!username || !password) {
            throw new InvalidFieldValueException(`Empty field found in user creation`);
        }
        const existentUser = await this.prisma.user.findUnique({
            where: { username }
        });
        if (existentUser !== null) {
            throw new UserAlreadyExistsException(`User with username ${username} already exists`);
        }
        const hashedPassword = this.cryptService.hash(password);
        return this.prisma.user.create({
            data: { username: username, password: hashedPassword }
        });
    }
    async getOne(username: string): Promise<User> {
        const user = await this.prisma.user.findUnique({
            where: { username }
        });
        if (user === null) {
            throw new NotFoundException(`User with username ${username} was not found`);
        }
        return user;
    }
}