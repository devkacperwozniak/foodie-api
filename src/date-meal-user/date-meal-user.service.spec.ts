import { Test, TestingModule } from '@nestjs/testing';
import { DateMealUserService } from './date-meal-user.service';

describe('DateService', () => {
  let service: DateMealUserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DateMealUserService],
    }).compile();

    service = module.get<DateMealUserService>(DateMealUserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
