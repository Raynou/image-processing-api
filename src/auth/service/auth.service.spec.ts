import { Test, TestingModule } from '@nestjs/testing';
import { UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../prisma/prisma.service';
import { CryptService } from './crypt.service';
import { NotFoundException } from '@nestjs/common';

describe('AuthService', () => {
  type User = { id: number; username: string; password: string };

  let service: AuthService;

  const mockUser: User = {
    id: 1,
    username: 'Foo',
    password: '12345',
  };

  const mockJWT = 'jwt_header.jwt_payload.jwt_sign';

  const mockJWTService = {
    signAsync: jest.fn(),
  };

  const mockCryptService = {
    hash: jest.fn(),
  };

  const mockPrismaService = {
    user: {
      create: jest.fn(),
      findUnique: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: CryptService,
          useValue: mockCryptService,
        },
        {
          provide: JwtService,
          useValue: mockJWTService,
        },
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  describe('login', () => {
    it('should return a JWT', async () => {
      mockCryptService.hash.mockReturnValue(mockUser.password);
      mockJWTService.signAsync.mockReturnValue(mockJWT);
      mockPrismaService.user.findUnique.mockReturnValue(mockUser);

      const result = await service.login(mockUser.username, mockUser.password);
      const keys = Object.keys(result);
      expect(keys).toEqual(expect.arrayContaining(['token']));
      expect(typeof result.token).toBe('string');
    });
    it('should throw error when credentials are invalid', async () => {
      mockCryptService.hash.mockReturnValue('void');
      mockPrismaService.user.findUnique.mockReturnValue(mockUser);

      const badCredentialsUser = {
        username: mockUser.username,
        password: 'void',
      };
      await expect(
        service.login(badCredentialsUser.username, badCredentialsUser.password),
      ).rejects.toThrow(new UnauthorizedException());
    });
    it("should throw error when user doesn't exists", async () => {
      mockPrismaService.user.findUnique.mockReturnValue(null);

      const nonExistentUser = {
        username: 'ImNotExists',
        password: 'void',
      };
      await expect(
        service.login(nonExistentUser.username, nonExistentUser.password),
      ).rejects.toThrow(NotFoundException);
    });
  });
  describe('register', () => {
    it('should return object "{ id: id, username: string }"', async () => {
      mockPrismaService.user.create.mockReturnValue(mockUser)
      
      const result = await service.register(
        mockUser.username,
        mockUser.password,
      );
      expect(result).toEqual({
        id: mockUser.id,
        username: mockUser.username,
      });
    });
  });
});
