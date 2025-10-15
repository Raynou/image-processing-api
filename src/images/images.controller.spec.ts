import { Test, TestingModule } from '@nestjs/testing';
import { ImageProcessingController } from './images.controller';
import { ImageProcessingService } from './images.service';
import { AuthGuard } from '../auth/auth.guard';
const httpMock = require('node-http-mock');

describe('ImageProcessingController', () => {
  let controller: ImageProcessingController;

  const mockImageProcessingService = {
    apply: jest.fn(),
    getOne: jest.fn(),
    getAll: jest.fn(),
    upload: jest.fn(),
  };

  const mockRequest = httpMock.createRequest();
  mockRequest.user = { sub: 1, username: 'MockUser' };

  const images = [
    {
      id: 1,
      image_link: 'http://foo.example/image1.png',
    },
    {
      id: 2,
      image_link: 'http://foo.example/image2.png',
    },
  ];

  const oneImage = images[0];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ImageProcessingController],
      providers: [
        {
          provide: ImageProcessingService,
          useValue: mockImageProcessingService,
        },
      ],
    })
      .overrideGuard(AuthGuard)
      .useValue({ canActivate: jest.fn().mockImplementation(() => true) })
      .compile();

    controller = module.get<ImageProcessingController>(
      ImageProcessingController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
  describe('retrieveImage', () => {
    it('retrieve an image object "{ id: number, image_link: string }"', async () => {
      mockImageProcessingService.getOne.mockResolvedValueOnce(oneImage);
      const result = await controller.retrieveImage('1', mockRequest);
      expect(result).toEqual(
        expect.objectContaining({
          id: expect.any(Number),
          image_link: expect.any(String),
        }),
      );
    });
  });
  describe('listImages', () => {
    it('return a list of images', async () => {
      mockImageProcessingService.getAll.mockResolvedValueOnce(images);
      const result = await controller.listImages(mockRequest);
      expect(result).toEqual();
    });
  });
  describe('uploadImage', () => {});
  describe('transformImage', () => {});
});
