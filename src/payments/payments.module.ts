import { Module } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { PaymentsResolver } from './payments.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Payment } from './entities/payment.entity';
import { User } from 'src/users/entities/user.entity';
import { DateMealUser } from 'src/date-meal-user/entities/date-meal-user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Payment, User, DateMealUser])],
  controllers: [PaymentsResolver],
  providers: [PaymentsService, PaymentsResolver],
  exports: [PaymentsService, TypeOrmModule.forFeature([Payment])],
})
export class PaymentsModule {}
