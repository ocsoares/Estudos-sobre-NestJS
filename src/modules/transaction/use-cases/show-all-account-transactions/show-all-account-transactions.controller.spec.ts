import { Test, TestingModule } from '@nestjs/testing';
import { ShowAllAccountTransactionsController } from './show-all-account-transactions.controller';

describe('ShowAllAccountTransactionsController', () => {
    let controller: ShowAllAccountTransactionsController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [ShowAllAccountTransactionsController],
        }).compile();

        controller = module.get<ShowAllAccountTransactionsController>(
            ShowAllAccountTransactionsController,
        );
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});
