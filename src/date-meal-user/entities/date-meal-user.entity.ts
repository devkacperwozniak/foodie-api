import { Meal } from 'src/meals/entities/meal.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { DateEntity } from './date.entity';
import { User } from 'src/users/entities/user.entity';
import { Field, ID, ObjectType } from '@nestjs/graphql';

@Entity()
@ObjectType()
export class DateMealUser {
  @PrimaryGeneratedColumn()
  @Field(() => ID, { description: 'a unique identifier' })
  id: number;

  @ManyToOne(() => Meal, (meal) => meal.dateMealUsers)
  meal: Meal;

  @ManyToOne(() => DateEntity, (dateEntity) => dateEntity.dateMealUsers)
  date: DateEntity;

  @ManyToOne(() => User, (user) => user.dateMealUsers)
  user: User;

  @Column()
  occurence: number;

  @Column()
  paid: boolean;
}
