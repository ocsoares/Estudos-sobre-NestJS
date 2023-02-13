/* eslint-disable @typescript-eslint/naming-convention */

import { Test, TestingModule } from '@nestjs/testing';
import { ITransaction } from 'src/models/ITransaction';
import { UserRepository } from '../../../../repositories/abstracts/UserRepository';
import { TransactionRepository } from '../../../../repositories/abstracts/TransactionRepository';
import { IReturnTransfer } from './interfaces/IReturnTransfer';
import { MakeTransferService } from './make-transfer.service';
import { IUser } from 'src/models/IUser';

describe('MakeTransferService', () => {
    let service: MakeTransferService;
    let transactionRepository: TransactionRepository;
    let userRepository: UserRepository;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                MakeTransferService,
                {
                    provide: TransactionRepository,
                    useValue: {
                        create: jest.fn(),
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

        service = module.get<MakeTransferService>(MakeTransferService);
        transactionRepository = module.get<TransactionRepository>(
            TransactionRepository,
        );
        userRepository = module.get<UserRepository>(UserRepository);

        jest.spyOn(service, 'execute');
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
        expect(transactionRepository).toBeDefined();
        expect(userRepository).toBeDefined();
    });

    it('should make a transfer', async () => {
        // Mockando porque se o Id EXISTIR, PASSA do If !!!
        (userRepository.findById as jest.Mock).mockResolvedValue({} as IUser);

        const userData: ITransaction = {
            account_id: 'any_account_id',
            transfer_amount: 1250.483742,
            description: 'Iphone X',
            payment_method: 'credit_card',
            card_number: '5286221899691501',
            card_holder: 'Lucas Batista',
            card_expiration_date: '08/25',
            cvv: '375',
        };

        const expectedMakeTransfer: IReturnTransfer = {
            date: new Date(),
            transfer_amount: 1250.48,
            description: userData.description,
            payment_method: userData.payment_method,
            card_number: '....-1501',
            card_holder: userData.card_holder,
        };

        // OBS: O date NÃO foi passado aqui porque ele é Gerado AUTOMATICAMENTE no Banco de Dados, então coloquei
        // como RETORNO no expectedMakeTransfer Acima !!!
        (transactionRepository.create as jest.Mock).mockResolvedValue({
            account_id: 'any_account_id',
            ...expectedMakeTransfer,
            _id: 'any_id',
            createdAt: new Date(),
            updatedAt: new Date(),
            __v: 0,
        });

        const makeTransfer = await service.execute(userData);

        expect(makeTransfer).toEqual(expectedMakeTransfer);
        expect(userRepository.findById).toHaveBeenCalledTimes(1);
        expect(service.execute).toHaveBeenCalledTimes(1);
        expect(service.execute).toHaveBeenCalledWith(userData);
    });
});
