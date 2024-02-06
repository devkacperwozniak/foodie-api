import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateMealInput } from './dto/create-meal.input';
import { UpdateMealInput } from './dto/update-meal.input';
import { InjectRepository } from '@nestjs/typeorm';
import { Meal } from './entities/meal.entity';
import { Repository } from 'typeorm';
import { UserInputError } from '@nestjs/apollo';

@Injectable()
export class MealsService {
  constructor(
    @InjectRepository(Meal)
    private readonly mealRepository: Repository<Meal>,
  ) {}
  create(createMealInput: CreateMealInput) {
    const meal = this.mealRepository.create(createMealInput);
    return this.mealRepository.save(meal);
  }

  findAll() {
    return this.mealRepository.find();
  }

  findOne(id: number) {
    const meal = this.mealRepository.findOne({ where: { id } });
    if (!meal) {
      throw new UserInputError(`Meal #${id} does not exist`);
    }
    return meal;
  }

  update(id: number, updateMealInput: UpdateMealInput) {
    return `This action updates a #${id} meal`;
  }

  async remove(id: number): Promise<Meal> {
    const meal = await this.findOne(id);
    if (!meal) {
      throw new NotFoundException(`Meal ID ${id} not found`);
    }
    await this.mealRepository.remove(meal);
    return { ...meal, id };
  }
}
