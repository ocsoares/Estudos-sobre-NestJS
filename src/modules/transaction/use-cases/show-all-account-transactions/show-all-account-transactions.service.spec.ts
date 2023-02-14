import { Test, TestingModule } from '@nestjs/testing';
import { TransactionRepository } from '../../../../repositories/abstracts/TransactionRepository';
import { UserRepository } from '../../../../repositories/abstracts/UserRepository';
import { ShowAllAccountTransactionsService } from './show-all-account-transactions.service';

describe('ShowAllAccountTransactionsService', () => {
    let service: ShowAllAccountTransactionsService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                ShowAllAccountTransactionsService,
                {
                    provide: TransactionRepository,
                    useValue: {
                        findAllById: jest.fn(),
                    },
                },
                {
                    provide: UserRepository,
                    useValue: {
                        findById: jest.fn(),
                    },
                },
            ],
        }).compile();

        service = module.get<ShowAllAccountTransactionsService>(
            ShowAllAccountTransactionsService,
        );
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
