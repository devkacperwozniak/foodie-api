import { InputType } from '@nestjs/graphql';
import { IsNumber, IsString, Matches, MinLength } from 'class-validator';

@InputType()
export class CreateMealInput {
  @IsNumber()
  price: number;

  @MinLength(3)
  @IsString()
  type: string;

  @MinLength(3)
  @IsString()
  title: string;

  @IsString()
  description: string;

  @Matches(/^(https?:\/\/)/, {
    message: 'imageSource musi zaczynać się od http:// lub https://',
  })
  @IsString()
  imageSource: string;
}
