import { Injectable } from '@nestjs/common';
import { createHmac } from 'node:crypto';

@Injectable()
export class CryptService {
    hash(input: string): string {
        return createHmac('sha256', 'secret')
            .update(input)
            .digest('hex')
    }
}
