/* eslint-disable @typescript-eslint/naming-convention */

import { MongooseModule } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import mongoose from 'mongoose';
import { ITransaction } from 'src/models/ITransaction';
import { InMemoryDbModule } from '../../../../modules/in-memory-database/in-memory-database.module';
import { Transaction, TransactionSchema } from '../schemas/transaction.schema';
import { MongooseTransactionRepository } from './MongooseTransactionRepository';

describe('MongooseTransactionRepository', () => {
    let transactionRepository: MongooseTransactionRepository;

    // Usando o Banco de Dados In Memory (Mongoose) !!
    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [
                InMemoryDbModule,
                MongooseModule.forFeature([
                    { name: Transaction.name, schema: TransactionSchema },
                ]),
            ],
            providers: [MongooseTransactionRepository],
        }).compile();

        transactionRepository = module.get<MongooseTransactionRepository>(
            MongooseTransactionRepository,
        );

        jest.spyOn(transactionRepository, 'create');
    });

    it('should be defined', () => {
        expect(transactionRepository).toBeDefined();
    });

    it('should make a transfer', async () => {
        const userData: ITransaction = {
            account_id: 'any_account_id',
            transfer_amount: 1250.42, // Fix to Two decimal places in Service (Original = 1250.423742)
            description: 'Iphone X',
            payment_method: 'credit_card',
            card_number: '...-1501', // 1501 = Last Four digits in Service (Original = 5286221899691501)
            card_holder: 'Lucas Batista',
            card_expiration_date: '08/25',
            cvv: '375',
        };

        const expectedMakeTransfer = {
            account_id: 'any_account_id',
            transfer_amount: 1250.42,
            description: 'Iphone X',
            payment_method: 'credit_card',
            card_number: '...-1501',
            card_holder: 'Lucas Batista',
            _id: expect.any(mongoose.Types.ObjectId),
            date: expect.any(Date),
            createdAt: expect.any(Date),
            updatedAt: expect.any(Date),
            __v: 0,
        };

        const makeTransfer = await transactionRepository.create(userData);

        expect(makeTransfer).toEqual(expectedMakeTransfer);
        expect(transactionRepository.create).toHaveBeenCalledTimes(1);
        expect(transactionRepository.create).toHaveBeenCalledWith(userData);
    });
});
