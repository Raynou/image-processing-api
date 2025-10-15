import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './service/auth.service';
import { CredentialsDTO } from './dto/credentials.dto';

describe('AuthController', () => {
  let authController: AuthController;

  const mockJWT = {
    token: 'jwt_header.jwt_payload.jwt_sign',
  };

  const mockUser = {
    id: 1,
    username: 'MockUser',
    password: 'MockPassword',
  };

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            login: jest.fn().mockReturnValue(mockJWT),
            register: jest.fn().mockReturnValue({
              id: mockUser.id,
              username: mockUser.username,
            }),
          },
        },
      ],
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
        password: '12345',
      };
      const res = authController.login(mockCreds);
      expect(res).toBe(mockJWT);
    });
  });

  describe('register', () => {
    it('should return "{ id: number, username: string }"', async () => {
      expect(
        authController.register({
          username: mockUser.username,
          password: mockUser.password,
        }),
      ).toEqual({
        id: mockUser.id,
        username: mockUser.username,
      });
    });
  });
});
