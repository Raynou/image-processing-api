import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { User } from '../generated/prisma';
import { PrismaService } from './../src/prisma/prisma.service';
import { AuthModule } from './../src/auth/auth.module';

describe('AuthController (e2e)', () => {
  let app: INestApplication<App>;
  let prisma: PrismaService;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AuthModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    prisma = app.get<PrismaService>(PrismaService);
    await app.init();
  });

  describe('POST /auth/register', () => {
    it('should return a 201 with "{ id: number, username: string }"', () => {
        return request(app.getHttpServer())
        .post('/auth/register')
        .send({
            username: 'ImRaynou',
            password: '12345'
        })
        .expect(201)
        .expect({
            id: 1,
            username: 'ImRaynou'
        });
    })
  });

  describe('POST /auth/login', () => {
    it('should return a 200 with a JWT', () => {
      return request(app.getHttpServer())
        .post('/auth/login')
        .send({ /* Your body goes here */ })
        .expect(200)
        //.expect();
    });
  });
});
