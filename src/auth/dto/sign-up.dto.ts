import { IsString, IsStrongPassword } from 'class-validator';

export class SignUpDTO {
  @IsString()
  username: string;

  @IsString()
  @IsStrongPassword()
  password: string;
}
