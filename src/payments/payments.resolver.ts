import { Body, Controller, Headers, Post, Req } from '@nestjs/common';
import { Args, GraphQLISODateTime, ID, Query, Resolver } from '@nestjs/graphql';
import { PaymentsService } from './payments.service';
import { Auth } from 'src/iam/authentication/decorators/auth.decorator';
import { AuthType } from 'src/iam/authentication/enums/auth-type.enum';
import { CheckoutDto } from './dto/checkout.dto';
import { Payment } from './entities/payment.entity';

@Controller('payments')
@Resolver(() => Payment)
@Auth(AuthType.None)
export class PaymentsResolver {
  constructor(private paymentService: PaymentsService) {}

  @Post('checkout')
  async checkout(@Body() checkoutDto: CheckoutDto[]) {
    return this.paymentService.checkout(checkoutDto);
  }

  @Post('webhook')
  async webhook(
    @Req() req: any,
    @Headers('stripe-signature') signature: string,
  ) {
    return this.paymentService.handleWebhookRequest(req.body, signature);
  }

  @Query(() => [Payment], { name: 'paymentsRange' })
  findMany(
    @Args('dateFrom', { type: () => GraphQLISODateTime }) dateFrom: string,
    @Args('dateTo', { type: () => GraphQLISODateTime }) dateTo: string,
  ) {
    return this.paymentService.findMany(dateFrom, dateTo);
  }

  @Query(() => Payment, { name: 'payment' })
  findOne(@Args('id', { type: () => ID }) id: number) {
    return this.paymentService.findOne(id);
  }

  @Query(() => [Payment], { name: 'payments' })
  findAll() {
    return this.paymentService.findAll();
  }
}
