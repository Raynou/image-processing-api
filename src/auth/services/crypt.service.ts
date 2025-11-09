import { Injectable } from '@nestjs/common';
import { createHmac } from 'node:crypto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class CryptService {
  constructor(private readonly configService: ConfigService) {}

  hash(input: string): string {
    const secret = this.configService.get<string>('CRYPT_SECRET');
    if (!secret) {
      throw new Error(`CRYPT_SECRET was not declared as an environment variable`);
    }
    return createHmac('sha256', secret).update(input).digest('hex');
  }
}
