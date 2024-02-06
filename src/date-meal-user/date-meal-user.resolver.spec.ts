import { Test, TestingModule } from '@nestjs/testing';
import { DateMealUserResolver } from './date-meal-user.resolver';

describe('DateController', () => {
  let controller: DateMealUserResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DateMealUserResolver],
    }).compile();

    controller = module.get<DateMealUserResolver>(DateMealUserResolver);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
