import { IsEmail, MinLength } from 'class-validator';

export class SignUpDto {
  @MinLength(3)
  username: string;

  @IsEmail()
  email: string;

  @MinLength(8)
  password: string;
}
