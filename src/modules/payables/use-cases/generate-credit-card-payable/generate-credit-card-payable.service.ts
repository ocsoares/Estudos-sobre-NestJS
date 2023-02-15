import { Injectable } from '@nestjs/common';
import { IService } from 'src/interfaces/IService';
import { IPayable } from 'src/models/IPayable';
import { PayablesRepository } from 'src/repositories/abstracts/PayablesRepository';
import { TransactionRepository } from 'src/repositories/abstracts/TransactionRepository';

@Injectable()
export class GenerateCreditCardPayableService implements IService {
    constructor(
        private readonly _generateCreditCardPayableRepository: PayablesRepository,
        private readonly _transactionRepository: TransactionRepository,
    ) {}

    async execute(transfer_id: string): Promise<IPayable> {
        return null;
    }
}
