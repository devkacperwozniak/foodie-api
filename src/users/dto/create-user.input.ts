import { InputType } from '@nestjs/graphql';
import { IsEmail, MinLength } from 'class-validator';

@InputType()
export class CreateUserInput {
  @MinLength(3)
  username: string;

  @IsEmail()
  email: string;

  @MinLength(8)
  password: string;
}
