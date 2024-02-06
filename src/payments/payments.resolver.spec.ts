import { Test, TestingModule } from '@nestjs/testing';
import { PaymentsResolver } from './payments.resolver';

describe('PaymentsController', () => {
  let controller: PaymentsResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PaymentsResolver],
    }).compile();

    controller = module.get<PaymentsResolver>(PaymentsResolver);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
