import { Injectable } from '@nestjs/common';
import Stripe from 'stripe';
import { CheckoutDto } from './dto/checkout.dto';
import { SignUpDto } from 'src/iam/authentication/dto/sign-up.dto';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Payment } from './entities/payment.entity';
import { Between, Repository } from 'typeorm';
import { CreatePaymentInput } from './dto/create-payment.input';
import { UserInputError } from '@nestjs/apollo';
import { User } from 'src/users/entities/user.entity';
import { DateTime } from 'luxon';
import { DateMealUser } from 'src/date-meal-user/entities/date-meal-user.entity';

@Injectable()
export class PaymentsService {
  private readonly stripe: Stripe;
  private configService: ConfigService;

  constructor(
    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(DateMealUser)
    private readonly dateMealUserRepository: Repository<DateMealUser>,
  ) {
    this.configService = new ConfigService();
    this.stripe = new Stripe(this.configService.get('STRIPE_TEST'), {
      apiVersion: '2023-10-16',
    });
  }

  async createCustomer(signUpDto: SignUpDto): Promise<Stripe.Customer> {
    return this.stripe.customers.create({
      email: signUpDto.email,
      name: signUpDto.username,
    });
  }

  findAll() {
    return this.paymentRepository.find();
  }

  findOne(id: number) {
    const payment = this.paymentRepository.findOne({ where: { id } });
    if (!payment) {
      throw new UserInputError(`Payment with date #${id} does not exist`);
    }
    return payment;
  }

  findMany(dFrom: string, dTo: string) {
    const dateFrom = new Date(dFrom);
    const dateTo = new Date(dTo);
    const payments = this.paymentRepository.find({
      where: {
        created_at: Between(dateFrom, dateTo),
        // user_id: userId,
      },
    });

    if (!payments) {
      throw new UserInputError(
        `Payment with date #${dFrom} - ${dTo} does not exist`,
      );
    }
    return payments;
  }

  async checkout(checkoutDto: CheckoutDto[]): Promise<string> {
    const lineItems = checkoutDto.map((element) => {
      return {
        quantity: 1,
        price_data: {
          currency: 'PLN',
          unit_amount: element.value * 100,
          product_data: {
            name: element.date,
          },
        },
      };
    });
    const dates = checkoutDto.map((el) => {
      return {
        date: el.date,
      };
    });
    const session = await this.stripe.checkout.sessions.create({
      cancel_url: 'https://innovativy.com/',
      customer_email: checkoutDto[0].email,
      line_items: lineItems,
      metadata: { dates: dates.join(',') },
      mode: 'payment',
      payment_method_types: ['blik', 'card', 'p24'],
      success_url: 'https://innovativy.com/',
    });
    return session.url;
  }

  async handleWebhookRequest(body: any, signature: any) {
    const secretEndpoint = this.configService.get('STRIPE_WEBHOOK_TEST');
    const event = this.stripe.webhooks.constructEvent(
      body,
      signature,
      secretEndpoint,
    );
    const getUser = async (event: Stripe.CheckoutSessionCompletedEvent) => {
      const user: User = await this.userRepository.findOneBy({
        email: event.data.object.customer_email,
      });
      return user;
    };

    const getDate = (event: Stripe.CheckoutSessionCompletedEvent) => {
      return DateTime.fromSeconds(event.created).toJSDate();
    };

    switch (event.type) {
      case 'checkout.session.completed':
        const dates = event.data.object.metadata.dates
          ? event.data.object.metadata.dates
          : '2023-01-16';
        event.data.object.customer_email = 'kacperwozniak1996@gmail.com';
        const user = await getUser(event);
        const createPaymentInput = {
          stripe_id: event.id,
          created_at: getDate(event),
          customer_email: event.data.object.customer_email,
          type: event.type,
          price: event.data.object.amount_total,
          user: user,
          dates,
        };
        this.savePayment(createPaymentInput);
        await this.dateMealUserRepository
          .createQueryBuilder()
          .update(DateMealUser)
          .set({ paid: true })
          .where('date IN (:...dates)', { dates: dates.split(',') })
          .execute();
    }
  }

  savePayment(createPaymentInput: CreatePaymentInput) {
    const payment = this.paymentRepository.create(createPaymentInput);
    return this.paymentRepository.save(payment);
  }
}
