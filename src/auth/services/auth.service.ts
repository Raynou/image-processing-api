import {
  Injectable,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CryptService } from './crypt.service';
import { PrismaService } from '../../prisma/prisma.service';
import { UserAlreadyExistsException } from '../exceptions/user-already-exists.exception';
import { InvalidFieldValueException } from '../exceptions/invalid-field-value.exception';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly cryptService: CryptService,
  ) {}

  /**
   * @throws {UnauthorizedException} if credentials are invalid
   */
  async login(username: string, password: string): Promise<{ token: string }> {
    const user = await this.prisma.user.findUnique({
      where: { username },
    });
    if (user === null) {
      throw new NotFoundException(
        `User with username ${username} was not found`,
      );
    }
    if (user?.password !== this.cryptService.hash(password)) {
      throw new UnauthorizedException();
    }
    const payload = { sub: user.id, username: user.username };
    return {
      token: await this.jwtService.signAsync(payload),
    };
  }

  async register(
    username: string,
    password: string,
  ): Promise<{ id: number; username: string }> {
    if (!username || !password) {
      throw new InvalidFieldValueException(
        `Empty field found in user creation`,
      );
    }
    const existentUser = await this.prisma.user.findUnique({
      where: { username },
    });
    if (existentUser !== null) {
      throw new UserAlreadyExistsException(
        `User with username ${username} already exists`,
      );
    }
    const hashedPassword = this.cryptService.hash(password);
    const user = await this.prisma.user.create({
      data: { username: username, password: hashedPassword },
    });
    return { id: user.id, username: user.username };
  }
}
