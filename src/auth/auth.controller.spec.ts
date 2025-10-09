import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { CredentialsDTO } from './dto/credentials.dto';

describe('AuthController', () => {
    let authController: AuthController;
    const mockJWT = {
        token: 'jwt_header.jwt_payload.jwt_sign'
    };
    beforeEach(async () => {
        const app: TestingModule = await Test.createTestingModule({
            controllers: [AuthController],
            providers: [
                {
                    provide: AuthService,
                    useValue: {
                        login: jest
                            .fn()
                            .mockReturnValue(new Promise((resolve) => {resolve(mockJWT)}))
                    }
                }
            ]
        }).compile();

        authController = app.get<AuthController>(AuthController);
    });

    it('should be defined', () => {
        expect(authController).toBeDefined();
    });
    describe('login', () => {
        it('should return JWT', () => {
            const mockCreds: CredentialsDTO = {
                username: 'raynou',
                password: '12345'
            };
            authController.login(mockCreds).then(res => {
                expect(res).toBe(mockJWT)
            });
        });
    })
});