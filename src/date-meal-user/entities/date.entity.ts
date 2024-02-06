import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Field, ID, ObjectType } from '@nestjs/graphql';
import { DateMealUser } from './date-meal-user.entity';

@Entity()
@ObjectType()
export class DateEntity {
  @PrimaryGeneratedColumn()
  @Field(() => ID, { description: 'a unique identifier' })
  id: number;

  @Column()
  date: Date;

  @OneToMany(() => DateMealUser, (dateMealUser) => dateMealUser.date)
  dateMealUsers: DateMealUser[];
}
