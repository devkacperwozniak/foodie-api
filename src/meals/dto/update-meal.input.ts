import { CreateMealInput } from './create-meal.input';
import { InputType, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateMealInput extends PartialType(CreateMealInput) {}
