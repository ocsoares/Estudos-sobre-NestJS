import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ITransaction } from 'src/models/ITransaction';
import { TransactionRepository } from 'src/repositories/abstracts/TransactionRepository';
import {
    Transaction,
    TransactionDocument,
} from '../schemas/transaction.schema';

@Injectable()
export class MongooseTransactionRepository implements TransactionRepository {
    constructor(
        @InjectModel(Transaction.name)
        private readonly _transactionModel: Model<TransactionDocument>,
    ) {}

    async create(data: ITransaction): Promise<ITransaction> {
        const makeTransfer = await this._transactionModel.create(data);

        return makeTransfer.toObject();
    }
}
