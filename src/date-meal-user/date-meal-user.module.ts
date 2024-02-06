import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DateEntity } from './entities/date.entity';
import { Meal } from 'src/meals/entities/meal.entity';
import { DateMealUserService } from './date-meal-user.service';
import { User } from 'src/users/entities/user.entity';
import { DateMealUserResolver } from './date-meal-user.resolver';
import { DateMealUser } from './entities/date-meal-user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([DateEntity, Meal, User, DateMealUser])],
  providers: [DateMealUserResolver, DateMealUserService],
})
export class DateMealUserModule {}
