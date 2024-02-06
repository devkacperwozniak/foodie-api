import { ObjectType, Field, ID } from '@nestjs/graphql';
import { DateMealUser } from 'src/date-meal-user/entities/date-meal-user.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Column,
  Entity,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
@ObjectType()
export class Meal {
  @PrimaryGeneratedColumn()
  @Field(() => ID, { description: 'a unique identifier' })
  id: number;

  @Column()
  title: string;

  @Column()
  price: number;

  @Column()
  type: string;

  @Column()
  description: string;

  @Column()
  imageSource: string;

  @ManyToMany(() => User)
  users: User[];

  @OneToMany(
    () => DateMealUser,
    (mealUserDates: DateMealUser) => mealUserDates.date,
  )
  mealDates: DateMealUser[];

  @OneToMany(
    () => DateMealUser,
    (mealUserDates: DateMealUser) => mealUserDates.meal,
  )
  dateMealUsers: DateMealUser[];
}
