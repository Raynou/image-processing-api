import { Injectable, NotImplementedException } from '@nestjs/common';
import sharp from 'sharp';
import Upscaler from 'upscaler';
import x4 from '@upscalerjs/esrgan-thick/4x';
import {
  type WatermarkOptions,
  type TextWatermarkOptions,
  type ImageWatermarkOptions,
} from '../types/image-processing.types';

@Injectable()
export class ProcessingService {
  async resize(
    image: Uint8Array<ArrayBufferLike>,
    params: { width: number; height: number },
  ) {
    return await sharp(image)
      .resize({ width: params.width, height: params.height, fit: 'fill' })
      .toBuffer();
  }

  async crop(
    image: Uint8Array<ArrayBufferLike>,
    params: { width: number; height: number; x: number; y: number },
  ) {
    return await sharp(image)
      .extract({
        left: params.x,
        top: params.y,
        width: params.width,
        height: params.height,
      })
      .toBuffer();
  }

  async rotate(image: Uint8Array<ArrayBufferLike>, degrees: number) {
    return await sharp(image).rotate(degrees).toBuffer();
  }

  async filters(
    image: Uint8Array<ArrayBufferLike>,
    filters: { grayscale: boolean; sepia: boolean },
  ) {
    let pipeline = sharp(image);
    /**
     * FIXME: The grayscale filter overrides every else so
     * it's pointless to this "pipeline" approach. Change this
     * code in order to just apply a filter at once.
     */
    if (filters.grayscale) {
      pipeline.grayscale();
    } else if (filters.sepia) {
      pipeline.tint({ r: 112, g: 66, b: 20 });
    }
    return await pipeline.toBuffer();
  }

  async mirror(image: Uint8Array<ArrayBufferLike>) {
    return await sharp(image).flip().toBuffer();
  }

  /**
   * Compress JPG file
   */
  async compress(
    image: Uint8Array<ArrayBufferLike>,
    params: { quality: number },
  ) {
    return await sharp(image)
      .jpeg({
        quality: params.quality,
      })
      .toBuffer();
  }

  async applyWatermark(
    image: Uint8Array<ArrayBufferLike>,
    options: WatermarkOptions,
  ) {
    if (options.type === 'image') {
      return this.applyImageWatermark(image, options);
    } else if (options.type === 'text') {
      return this.applyTextWatermark(image, options);
    } else {
      throw new Error('Unsupported watermark application procedure');
    }
  }

  private async applyImageWatermark(
    image: Uint8Array<ArrayBufferLike>,
    options: ImageWatermarkOptions,
  ): Promise<Buffer<ArrayBufferLike>> {
    return await sharp(image)
      .composite([
        {
          input: Buffer.from(options.image),
          gravity: options.position || 'center',
        },
      ])
      .toBuffer();
  }

  private async applyTextWatermark(
    image: Uint8Array<ArrayBufferLike>,
    options: TextWatermarkOptions,
  ): Promise<Buffer<ArrayBufferLike>> {
    // FIXME: This doesn't work properly
    // I copied this code from the following chat:
    // https://claude.ai/chat/4671cbb1-83b9-4689-a1b1-23e1c593f97e
    const textSvg = `
    <svg width="200" height="50">
      <text x="10" y="40"
            font-size="${options?.size || 24}"
            fill="${options.color || 'white'}">
        ${options.text}
      </text>
    </svg>
  `;
    return await sharp(image)
      .composite([
        {
          input: Buffer.from(textSvg),
          gravity: options.position || 'center',
        },
      ])
      .toBuffer();
  }

  async aiUpScale(
    image: Uint8Array<ArrayBufferLike>,
    options: { width: number, height: number }
  ): Promise<Buffer<ArrayBufferLike>> {
    /**
     * You can start using this library: https://upscalerjs.com/ and then
     * you can scale this to a microservice built with python to improve
     * perfomance and the scaling results:
     * https://chatgpt.com/c/69087963-17e8-8327-8af7-bdc712f50c06
     * https://claude.ai/chat/e9d7331d-6af2-4e91-97f3-ce3bc23f3bff
     */
    const upscaler = new Upscaler({
      model: x4,
    });
    // This is a Base64 URI 
    const upscaledImage = await upscaler.upscale({
      width: options.width,
      height: options.height,
      data: image,
    });
    return Buffer.from(upscaledImage);
  }

  async removeWatermark(): Promise<Buffer<ArrayBufferLike>> {
    throw new NotImplementedException();
  }
}
