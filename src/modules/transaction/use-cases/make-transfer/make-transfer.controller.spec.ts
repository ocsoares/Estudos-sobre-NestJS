import { Test, TestingModule } from '@nestjs/testing';
import { TransactionRepository } from '../../../../repositories/abstracts/TransactionRepository';
import { MakeTransferController } from './make-transfer.controller';
import { MakeTransferService } from './make-transfer.service';

describe('MakeTransferController', () => {
    let controller: MakeTransferController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [MakeTransferController],
            providers: [
                MakeTransferService,
                {
                    provide: TransactionRepository,
                    useValue: {},
                },
            ],
        }).compile();

        controller = module.get<MakeTransferController>(MakeTransferController);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});
