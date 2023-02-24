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

        makeTransfer.transfer_id = makeTransfer._id;
        await makeTransfer.save();

        return makeTransfer.toObject();
    }

    async findOneById(transfer_id: string): Promise<ITransaction> {
        const transaction = await this._transactionModel.findById(transfer_id);

        return transaction.toObject();
    }

    async findAllById(account_id: string): Promise<ITransaction[]> {
        const transactions = await this._transactionModel.find({ account_id });

        return transactions.map((prop) => ({
            ...prop.toObject(),
        }));
    }
}
