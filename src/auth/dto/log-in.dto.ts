import { IsString } from 'class-validator';

export class LogInDTO {
  @IsString()
  username: string;

  @IsString()
  password: string;
}
