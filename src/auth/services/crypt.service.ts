import { Injectable } from '@nestjs/common';
import { createHmac } from 'node:crypto';
import { cryptConstants } from '../constants';

@Injectable()
export class CryptService {
    hash(input: string): string {
        const secret = cryptConstants.secret;
        if (!secret) {
            throw new Error("Crypt secret was not declared as environment variable")
        }
        return createHmac('sha256', secret)
            .update(input)
            .digest('hex')
    }
}
