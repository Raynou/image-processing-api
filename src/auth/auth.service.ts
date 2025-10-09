import { Injectable, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class AuthService {
    /**
     * @throws {UnauthorizedException} if credentials are invalid
    */
    async login(username: string, password: string): Promise<{token: string}> {
        throw new Error('Method not implemented.');
    }
    /**
     * @throws {UserAlreadyExistsException} if the user already exists
    */
    async register(username: string, password: string) {
        throw new Error('Method not implemented.');
    }
}