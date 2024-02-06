import { AuthType } from 'src/iam/authentication/enums/auth-type.enum';
import { Auth } from 'src/iam/authentication/decorators/auth.decorator';
import { DateMealUserService } from './date-meal-user.service';
import { DateMealUserInput } from './dto/create-meal-date-user.input';
import { DateMealUser } from './entities/date-meal-user.entity';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';

@Resolver(() => DateMealUser)
@Auth(AuthType.None)
export class DateMealUserResolver {
  constructor(private readonly dateService: DateMealUserService) {}

  @Mutation(() => [DateMealUser])
  async createDateMealUser(
    @Args('createDateMealUserInput') createDateMealUser: DateMealUserInput,
  ) {
    return this.dateService.createMealsForUserInParticularDay(
      createDateMealUser,
    );
  }

  @Query(() => [DateMealUser], { name: 'mealsInDays' })
  async getDateMealUsersForUserAndDay(
    @Args('userEmail', { type: () => String }) userEmail: string,
  ) {
    return this.dateService.getDateMealUsersForUserAndDay(userEmail);
  }

  @Query(() => [DateMealUser], { name: 'mealsInDaysConstrained' })
  async getDateMealUsersForUserAndDayConstrained(
    @Args('userEmail', { type: () => String }) userEmail: string,
    @Args('dateFrom', { type: () => String }) dateFrom: string,
    @Args('dateTo', { type: () => String }) dateTo: string,
  ) {
    return this.dateService.getDateMealUsersForUserAndDayConstrained({
      userEmail,
      dateFrom,
      dateTo,
    });
  }
}
