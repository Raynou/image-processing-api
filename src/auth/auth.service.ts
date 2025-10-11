import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { CryptService } from '../crypt/crypt.service';

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UserService,
        private readonly jwtService: JwtService,
        private readonly cryptService: CryptService
    ) {}

    /**
     * @throws {UnauthorizedException} if credentials are invalid
    */
    async login(username: string, password: string): Promise<{token: string}> {
        const user = await this.userService.getOne(username);
        if (user?.password !== this.cryptService.hash(password)) {
            throw new UnauthorizedException();
        }
        const payload = { sub: user.id, username: user.username };
        return {
            token: await this.jwtService.signAsync(payload)
        };
    }
    async register(username: string, password: string): Promise<{ id: number, username: string }> {
        const user = await this.userService.insertOne(username, password);
        return { id: user.id, username: user.username };
    }
}