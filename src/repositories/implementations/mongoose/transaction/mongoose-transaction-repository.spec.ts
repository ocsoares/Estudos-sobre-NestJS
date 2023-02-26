import { MongooseModule } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import mongoose from 'mongoose';
import { ITransaction } from 'src/models/ITransaction';
import { MongooseInMemoryDatabaseModule } from '../../../../modules/test/mongoose-in-memory-database.module';
import { Transaction, TransactionSchema } from '../schemas/transaction.schema';
import { MongooseTransactionRepository } from './MongooseTransactionRepository';

describe('MongooseTransactionRepository', () => {
    let transactionRepository: MongooseTransactionRepository;
    const testId = 'any_account_id';

    const userData: ITransaction = {
        account_id: testId,
        transfer_amount: 1250.42, // Fix to Two decimal places in Service (Original = 1250.423742)
        description: 'Iphone X',
        payment_method: 'credit_card',
        card_number: '...-1501', // 1501 = Last Four digits in Service (Original = 5286221899691501)
        card_holder: 'Lucas Batista',
        card_expiration_date: '08/25',
        cvv: '375',
    };

    const expectedMakeTransfer = {
        account_id: testId,
        transfer_id: expect.any(mongoose.Types.ObjectId),
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

    // Usando o Banco de Dados In Memory (Mongoose) !!
    // OBS: NÃO usei o beforeEach nesse teste porque ele A CADA Teste iria INICIAR, LIMPAR e FECHAR o
    // Banco de Dados In Memory, então usei o beforeAll para ele Limpar apenas no FINAL de TODOS os
    // testes !!!
    beforeAll(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [
                MongooseInMemoryDatabaseModule,
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
        jest.spyOn(transactionRepository, 'findAllById');
    });

    it('should be defined', () => {
        expect(transactionRepository).toBeDefined();
    });

    it('should make a transfer', async () => {
        const makeTransfer = await transactionRepository.create(userData);

        expect(makeTransfer).toEqual(expectedMakeTransfer);
        expect(transactionRepository.create).toHaveBeenCalledTimes(1);
        expect(transactionRepository.create).toHaveBeenCalledWith(userData);
    });

    it('should find all transactions by id', async () => {
        const transactions = await transactionRepository.findAllById(testId);

        expect(transactions).toEqual([expectedMakeTransfer]);
        expect(transactionRepository.findAllById).toHaveBeenCalledTimes(1);
        expect(transactionRepository.findAllById).toHaveBeenCalledWith(
            userData.account_id,
        );
    });
});
