import { Test, TestingModule } from '@nestjs/testing';
import { TransactionRepository } from '../../../../repositories/abstracts/TransactionRepository';
import { MakeTransferService } from './make-transfer.service';

describe('MakeTransferService', () => {
    let service: MakeTransferService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                MakeTransferService,
                {
                    provide: TransactionRepository,
                    useValue: {},
                },
            ],
        }).compile();

        service = module.get<MakeTransferService>(MakeTransferService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
