import { ObjectType, Field, ID, GraphQLISODateTime } from '@nestjs/graphql';
import { User } from 'src/users/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
@ObjectType()
export class Payment {
  @PrimaryGeneratedColumn()
  @Field(() => ID, { description: 'a unique identifier' })
  id: number;

  @Column()
  stripe_id: string;

  @Column()
  @Field(() => GraphQLISODateTime, { description: 'date of creation' })
  created_at: Date;

  @Column()
  customer_email: string;

  @Column()
  type: string;

  @Column()
  price: number;

  @Column()
  dates: string;

  @ManyToOne(() => User, (user) => user.payments)
  @JoinColumn({ name: 'user_id' })
  user: User;
}
