import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, In, Repository } from 'typeorm';
import { DateEntity } from 'src/date-meal-user/entities/date.entity';
import { DateMealUser } from 'src/date-meal-user/entities/date-meal-user.entity';
import { User } from 'src/users/entities/user.entity';
import { DateTime } from 'luxon';
import { Meal } from 'src/meals/entities/meal.entity';
import { DateMealUserInput } from './dto/create-meal-date-user.input';

@Injectable()
export class DateMealUserService {
  constructor(
    @InjectRepository(Meal)
    private readonly mealsRepository: Repository<Meal>,
    @InjectRepository(DateEntity)
    private readonly datesRepository: Repository<DateEntity>,
    @InjectRepository(DateMealUser)
    private readonly dateMealUserRepository: Repository<DateMealUser>,
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async createMealsForUserInParticularDay(
    createMealUserDateInput: DateMealUserInput,
  ) {
    const meals = await this.mealsRepository.find({
      where: { id: In(createMealUserDateInput.meals) },
    });

    const user = await this.usersRepository.findOneBy({
      email: createMealUserDateInput.userEmail,
    });
    const dateToJs = DateTime.fromFormat(
      createMealUserDateInput.date,
      'yyyy-MM-dd',
    ).toJSDate();

    const [dateFromDatabase] = await this.datesRepository.find({
      where: { date: dateToJs },
    });

    if (!dateFromDatabase || !meals.length || !user) {
      throw new BadRequestException('No meal / user / date found');
    }

    await this.dateMealUserRepository.delete({
      date: dateFromDatabase,
      user: user,
    });

    const mealsForUserInDay = meals.map((meal) => {
      return {
        occurence: 1,
        date: dateFromDatabase,
        meal,
        user,
        paid: false,
      };
    });

    const dateMealUser = this.dateMealUserRepository.create(mealsForUserInDay);
    return this.dateMealUserRepository.save(dateMealUser);
  }

  async getDateMealUsersForUserAndDay(
    userEmail: string,
  ): Promise<DateMealUser[]> {
    return this.dateMealUserRepository.find({
      where: { user: { email: userEmail }, paid: false },
      relations: ['meal', 'date'],
    });
  }

  async getDateMealUsersForUserAndDayConstrained({
    userEmail,
    dateFrom,
    dateTo,
  }: {
    userEmail: string;
    dateFrom: string;
    dateTo: string;
  }): Promise<DateMealUser[]> {
    const dateFromDT = DateTime.fromFormat(dateFrom, 'yyyy-MM-dd').toJSDate();
    const dateToDT = DateTime.fromFormat(dateTo, 'yyyy-MM-dd').toJSDate();
    return this.dateMealUserRepository.find({
      where: {
        user: { email: userEmail },
        date: { date: Between(dateFromDT, dateToDT) },
      },
      relations: ['meal', 'date'],
    });
  }
}
