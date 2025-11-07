import { Injectable, OnModuleInit } from '@nestjs/common';
import {
  S3Client,
  PutObjectCommand,
  CreateBucketCommand,
  DeleteObjectCommand,
  DeleteBucketCommand,
  paginateListObjectsV2,
  GetObjectCommand,
  S3ClientConfig,
  HeadBucketCommand,
  GetObjectCommandOutput,
  S3,
} from '@aws-sdk/client-s3';
import { constants } from '../constants';
import { ImageNotFoundException } from '../exceptions/image-not-found.exception';

@Injectable()
export class CloudStorageService implements OnModuleInit {
  private S3Client: S3Client;

  async onModuleInit() {
    const IS_DEV = process.env.NODE_ENV === 'development';
    // TODO: Use the following rereference to create this module:
    // https://docs.aws.amazon.com/sdk-for-javascript/v3/developer-guide/getting-started-nodejs.html
    // https://chatgpt.com/c/68f5937f-3edc-832f-8a6b-ebec5afb8868
    // We left configs empty in production mode because the SDK will read
    // read the config and credentials directly from the OS/.env file.
    const cfg: Partial<S3ClientConfig> = {};

    if (IS_DEV) {
      cfg.endpoint = constants.awsEndpoint || 'http://localhost:4566';
      cfg.credentials = { accessKeyId: 'test', secretAccessKey: 'test' };
      cfg.forcePathStyle = true;
    }

    this.S3Client = new S3Client(cfg);

    // Create a development bucket if not exists
    if (IS_DEV && !(await this.bucketExists(constants.bucketName))) {
      await this.S3Client.send(
        new CreateBucketCommand({
          Bucket: constants.bucketName,
        }),
      );
    }
  }

  private async bucketExists(bucket: string) {
    // Code obtained from:
    // https://stackoverflow.com/questions/50842835/how-do-i-test-if-a-bucket-exists-on-aws-s3
    const options = {
      Bucket: bucket,
    };
    try {
      await this.S3Client.send(new HeadBucketCommand(options));
      return true;
    } catch (error) {
      if (error['$metadata'].httpStatusCode === 404) {
        return false;
      }
      throw error;
    }
  }

  async uploadImage(key: string, content: Buffer<ArrayBufferLike>) {
    await this.S3Client.send(
      new PutObjectCommand({
        Bucket: constants.bucketName,
        Key: key,
        Body: content,
      }),
    );
  }

  async getImage(key: string): Promise<Uint8Array<ArrayBufferLike>> {
    const image = (
      await this.S3Client.send(
        new GetObjectCommand({
          Bucket: constants.bucketName,
          Key: key,
        }),
      )
    ).Body?.transformToByteArray();
    if (image === undefined) throw new ImageNotFoundException("");
    return image;
  }

  async deleteImage(key: string) {
    await this.S3Client.send(
      new DeleteObjectCommand({
        Bucket: constants.bucketName,
        Key: key,
      }),
    );
  }
}
