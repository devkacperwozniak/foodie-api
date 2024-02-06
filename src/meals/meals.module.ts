import { Module } from '@nestjs/common';
import { MealsService } from './meals.service';
import { MealsResolver } from './meals.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Meal } from './entities/meal.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Meal])],
  providers: [MealsResolver, MealsService],
})
export class MealsModule {}
