import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { MealsService } from './meals.service';
import { Meal } from './entities/meal.entity';
import { CreateMealInput } from './dto/create-meal.input';
import { UpdateMealInput } from './dto/update-meal.input';
import { ParseIntPipe } from '@nestjs/common';

@Resolver(() => Meal)
export class MealsResolver {
  constructor(private readonly mealsService: MealsService) {}

  @Mutation(() => Meal)
  createMeal(@Args('createMealInput') createMealInput: CreateMealInput) {
    return this.mealsService.create(createMealInput);
  }

  @Query(() => [Meal], { name: 'meals' })
  findAll() {
    return this.mealsService.findAll();
  }

  @Query(() => Meal, { name: 'meal' })
  findOne(@Args('id', { type: () => ID }) id: number) {
    return this.mealsService.findOne(id);
  }

  @Mutation(() => Meal)
  updateMeal(
    @Args('id') id: number,
    @Args('updateMealInput') updateMealInput: UpdateMealInput,
  ) {
    return this.mealsService.update(id, updateMealInput);
  }

  @Mutation(() => Meal)
  removeMeal(@Args('id', { type: () => ID }, ParseIntPipe) id: number) {
    return this.mealsService.remove(id);
  }
}
