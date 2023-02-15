/* eslint-disable @typescript-eslint/naming-convention */

import { Test, TestingModule } from '@nestjs/testing';
import { ITransaction } from 'src/models/ITransaction';
import { UserRepository } from '../../../../repositories/abstracts/UserRepository';
import { TransactionRepository } from '../../../../repositories/abstracts/TransactionRepository';
import { IReturnTransfer } from './interfaces/IReturnTransfer';
import { MakeTransferService } from './make-transfer.service';
import { IUser } from 'src/models/IUser';
import { GenerateCreditCardPayableService } from '../../../../modules/payables/use-cases/generate-credit-card-payable/generate-credit-card-payable.service';
import { GenerateDebitCardPayableService } from '../../../../modules/payables/use-cases/generate-debit-card-payable/generate-debit-card-payable.service';
import { PayablesRepository } from '../../../../repositories/abstracts/PayablesRepository';
import { BadRequestException } from '@nestjs/common';

describe('MakeTransferService', () => {
    let service: MakeTransferService;
    let generateCreditCardPayableService: GenerateCreditCardPayableService;
    let generateDebitCardPayableService: GenerateDebitCardPayableService;
    let transactionRepository: TransactionRepository;
    let userRepository: UserRepository;

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

    const transactionRepositoryCreateData = {
        ...expectedMakeTransfer,
        _id: 'any_id',
        transfer_id: 'any_id',
        createdAt: new Date(),
        updatedAt: new Date(),
        __v: 0,
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                MakeTransferService,
                {
                    provide: TransactionRepository,
                    useValue: {
                        create: jest.fn(),
                        findOneById: jest.fn(),
                    },
                },
                {
                    provide: UserRepository,
                    useValue: {
                        findById: jest.fn(),
                    },
                },
                GenerateCreditCardPayableService,
                GenerateDebitCardPayableService,
                {
                    provide: PayablesRepository,
                    useValue: {
                        create: jest.fn(),
                    },
                },
            ],
        }).compile();

        service = module.get<MakeTransferService>(MakeTransferService);
        generateCreditCardPayableService =
            module.get<GenerateCreditCardPayableService>(
                GenerateCreditCardPayableService,
            );
        generateDebitCardPayableService =
            module.get<GenerateDebitCardPayableService>(
                GenerateDebitCardPayableService,
            );
        transactionRepository = module.get<TransactionRepository>(
            TransactionRepository,
        );
        userRepository = module.get<UserRepository>(UserRepository);

        jest.spyOn(service, 'execute');
        jest.spyOn(generateCreditCardPayableService, 'execute');
        jest.spyOn(generateDebitCardPayableService, 'execute');
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
        expect(generateCreditCardPayableService).toBeDefined();
        expect(generateDebitCardPayableService).toBeDefined();
        expect(transactionRepository).toBeDefined();
        expect(userRepository).toBeDefined();
    });

    it(`should NOT make a transfer if user by id doesn't exists`, async () => {
        await expect(service.execute(userData)).rejects.toThrow(
            new BadRequestException(
                'Não foi possível encontrar o usuário pelo id fornecido !',
            ),
        );

        expect(userRepository.findById).toHaveBeenCalledTimes(1);
        expect(transactionRepository.findOneById).toHaveBeenCalledTimes(0);
        expect(service.execute).toHaveBeenCalledTimes(1);
        expect(generateCreditCardPayableService.execute).toHaveBeenCalledTimes(
            0,
        );
        expect(generateDebitCardPayableService.execute).toHaveBeenCalledTimes(
            0,
        );
    });

    it(`should NOT make a transfer if CREDIT card transfer by id doesn't exists`, async () => {
        (userRepository.findById as jest.Mock).mockResolvedValue({} as IUser);

        // Retorna o Erro porque o findOneById em GenerateCreditCardPayable NÃO foi
        // mockado, logo o Id NÃO existe !!

        (transactionRepository.create as jest.Mock).mockResolvedValue(
            transactionRepositoryCreateData,
        );

        await expect(service.execute(userData)).rejects.toThrow(
            new BadRequestException('Id de transferência inválido !'),
        );

        expect(userRepository.findById).toHaveBeenCalledTimes(1);
        expect(transactionRepository.findOneById).toHaveBeenCalledTimes(1);
        expect(service.execute).toHaveBeenCalledTimes(1);
        expect(generateCreditCardPayableService.execute).toHaveBeenCalledTimes(
            1,
        );
        expect(generateDebitCardPayableService.execute).toHaveBeenCalledTimes(
            0,
        );
    });

    it(`should NOT make a transfer if DEBIT card transfer by id doesn't exists`, async () => {
        (userRepository.findById as jest.Mock).mockResolvedValue({} as IUser);

        (transactionRepository.create as jest.Mock).mockResolvedValue({
            ...transactionRepositoryCreateData,
            payment_method: 'debit_card',
        });

        await expect(
            service.execute({
                ...userData,
                payment_method: 'debit_card',
            }),
        ).rejects.toThrow(
            new BadRequestException('Id de transferência inválido !'),
        );

        expect(userRepository.findById).toHaveBeenCalledTimes(1);
        expect(transactionRepository.findOneById).toHaveBeenCalledTimes(1);
        expect(service.execute).toHaveBeenCalledTimes(1);
        expect(generateCreditCardPayableService.execute).toHaveBeenCalledTimes(
            0,
        );
        expect(generateDebitCardPayableService.execute).toHaveBeenCalledTimes(
            1,
        );
    });

    it('should make a transfer', async () => {
        (userRepository.findById as jest.Mock).mockResolvedValue({} as IUser);

        (transactionRepository.findOneById as jest.Mock).mockResolvedValue(
            {} as ITransaction,
        );

        (transactionRepository.create as jest.Mock).mockResolvedValue(
            transactionRepositoryCreateData,
        );

        const makeTransfer = await service.execute(userData);

        expect(makeTransfer).toEqual(expectedMakeTransfer);
        expect(userRepository.findById).toHaveBeenCalledTimes(1);
        expect(userRepository.findById).toHaveBeenCalledWith(
            userData.account_id,
        );
        expect(service.execute).toHaveBeenCalledTimes(1);
        expect(service.execute).toHaveBeenCalledWith(userData);
        expect(generateCreditCardPayableService.execute).toHaveBeenCalledTimes(
            1,
        );
        expect(generateCreditCardPayableService.execute).toHaveBeenCalledWith(
            transactionRepositoryCreateData.transfer_id,
        );
        expect(generateDebitCardPayableService.execute).toHaveBeenCalledTimes(
            0,
        );
    });
});
