import { Body, Controller, HttpCode, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CredentialsDTO } from './dto/credentials.dto';
import { AuthGuard } from './auth.guard';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('login')
    login(@Body() credentialsDTO: CredentialsDTO) {
        return this.authService.login(credentialsDTO.username, credentialsDTO.password);
    }

    @Post('register')
    register(@Body() credentialsDTO: CredentialsDTO) {
        return this.authService.register(credentialsDTO.username, credentialsDTO.password);
    }
}