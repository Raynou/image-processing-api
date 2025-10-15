import { Body, Controller, HttpCode, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './service/auth.service';
import { CredentialsDTO } from './dto/credentials.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(200)
  login(@Body() credentialsDTO: CredentialsDTO) {
    return this.authService.login(
      credentialsDTO.username,
      credentialsDTO.password,
    );
  }

  @Post('register')
  register(
    @Body() credentialsDTO: CredentialsDTO,
  ): Promise<{ id: number; username: string }> {
    return this.authService.register(
      credentialsDTO.username,
      credentialsDTO.password,
    );
  }
}
