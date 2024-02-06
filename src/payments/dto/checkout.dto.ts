import { IsEmail, IsNumber, IsString } from 'class-validator';

export class CheckoutDto {
  @IsEmail()
  email: string;

  @IsString()
  date: string;

  @IsNumber()
  value: number;
}
