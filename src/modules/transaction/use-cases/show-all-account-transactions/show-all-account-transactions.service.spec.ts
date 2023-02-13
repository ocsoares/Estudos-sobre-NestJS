import { Test, TestingModule } from '@nestjs/testing';
import { ShowAllAccountTransactionsService } from './show-all-account-transactions.service';

describe('ShowAllAccountTransactionsService', () => {
  let service: ShowAllAccountTransactionsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ShowAllAccountTransactionsService],
    }).compile();

    service = module.get<ShowAllAccountTransactionsService>(ShowAllAccountTransactionsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
