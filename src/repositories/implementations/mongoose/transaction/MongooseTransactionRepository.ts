import { Injectable } from '@nestjs/common';
import { ITransaction } from 'src/models/ITransaction';
import { TransactionRepository } from 'src/repositories/abstracts/TransactionRepository';

@Injectable()
export class MongooseTransactionRepository implements TransactionRepository {
    // Fazer o Constructor !!!

    async create(data: ITransaction): Promise<ITransaction> {
        return 'a' as any;
    }
}
