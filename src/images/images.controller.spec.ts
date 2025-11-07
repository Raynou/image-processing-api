import { Test, TestingModule } from '@nestjs/testing';
import { ImagesController } from './images.controller';
import { ImagesService } from './services/images.service';
import { AuthGuard } from '../auth/auth.guard';
import httpMock from 'node-mocks-http';
import { Readable } from 'node:stream';
import { TransformationsDTO } from './dto/transformations.dto';

describe('ImageProcessingController', () => {
  let controller: ImagesController;

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

  const mockImage: Express.Multer.File = {
    fieldname: 'file',
    originalname: 'image.jpg',
    encoding: '7bit',
    mimetype: 'image/png',
    size: 1024,
    stream: Readable.from([Buffer.from([0x89, 0x50, 0x4e, 0x47])]),
    destination: '/foo',
    filename: 'test-image.png',
    path: '/foo/test-image.png',
    buffer: Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
  };

  const mockTransformationsDTO: TransformationsDTO = {
    imageId: '1'
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ImagesController],
      providers: [
        {
          provide: ImagesController,
          useValue: mockImageProcessingService,
        },
      ],
    })
      .overrideGuard(AuthGuard)
      .useValue({ canActivate: jest.fn().mockImplementation(() => true) })
      .compile();

    controller = module.get<ImagesController>(
      ImagesController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
  describe('retrieveImage', () => {
    it('should retrieve an image object "{ id: number, image_link: string }"', async () => {
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
      expect(result).toEqual(images);
    });
  });
  describe('uploadImage', () => {
    it('should upload an image', async () => {
      const result = await controller.uploadImage(mockImage, mockRequest);
      expect(result).toBe({
        id: oneImage.id,
        image_link: oneImage.image_link,
      });
    });
  });
  describe('transformImage', async () => { 
    const result = await controller.transformImage(mockTransformationsDTO, mockRequest);
   });
});
