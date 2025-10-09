import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CredentialsDTO } from './dto/credentials.dto';

@Controller()
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post()
    login(@Body() credentialsDTO: CredentialsDTO) {
        return this.authService.login(credentialsDTO.username, credentialsDTO.password);
    }

    @Post()
    register(@Body() credentialsDTO: CredentialsDTO) {
        return this.authService.register(credentialsDTO.username, credentialsDTO.password);
    }

}