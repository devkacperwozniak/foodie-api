import { InputType } from '@nestjs/graphql';
import { IsEmail, IsNumber, MinLength } from 'class-validator';
import { User } from 'src/users/entities/user.entity';

@InputType()
export class CreatePaymentInput {
  @MinLength(3)
  stripe_id: string;

  @MinLength(3)
  created_at: Date;

  @IsEmail()
  customer_email: string;

  @MinLength(3)
  type: string;

  @IsNumber()
  price: number;

  // @IsNumber()
  user: User;

  dates: string;
}
