import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { SignUpDTO } from './dto/sign-up.dto';
import { LogInDTO } from './dto/log-in.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(200)
  login(@Body() logInDTO: LogInDTO) {
    return this.authService.login(
      logInDTO.username,
      logInDTO.password,
    );
  }

  @Post('register')
  register(
    @Body() signUpDTO: SignUpDTO,
  ): Promise<{ id: number; username: string }> {
    return this.authService.register(
      signUpDTO.username,
      signUpDTO.password,
    );
  }
}
