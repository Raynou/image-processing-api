import { Test, TestingModule } from '@nestjs/testing';
import { UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';

type User = { id: number, username: string, password: string };

const userArray: User[] = [
    { id: 1, username: 'Foo', password: '12345' },
];
const oneUser = userArray[0];
const oneUserPromise = new Promise(resolve => { resolve(oneUser) });
const regexJWT = /e[yw][A-Za-z0-9-_]+\.(?:e[yw][A-Za-z0-9-_]+)?\.[A-Za-z0-9-_]{2,}(?:(?:\.[A-Za-z0-9-_]{2,}){2})?/g;

describe('AuthService', () => {
    let service: AuthService;
    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                JwtService,
                AuthService,
                {
                    provide: UserService,
                    useValue: {
                        getOne: jest
                            .fn()
                            .mockReturnValue(oneUserPromise),
                        insertOne: jest
                            .fn()
                            .mockReturnValue(oneUserPromise)
                    }
                }
            ]
        }).compile();

        service = module.get<AuthService>(AuthService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
    describe('login', () => {
        it('should return a JWT', async () => {
            const result = await service.login(oneUser.username, oneUser.password);
            expect.objectContaining({
                token: expect.any(String)
            })
            expect(result.token).toMatch(regexJWT);
        });
        it('should throw error when credentials are invalid', async () => {
            const nonExistentUser = {
                username: 'ImNotExist',
                password: 'void'
            };
            await expect(service.login(nonExistentUser.username, nonExistentUser.password))
            .rejects
            .toThrow(new UnauthorizedException);
        });
    });
    describe('register', () => {
        it('should return object "{ id: id, username: string }"', async () => {
            const result = await service.register(oneUser.username, oneUser.password);
            expect(result).toBe({
                id: oneUser.id,
                username: oneUser.username
            });
        });
    });
});