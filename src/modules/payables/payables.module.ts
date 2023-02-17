import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PayablesRepository } from '../../repositories/abstracts/PayablesRepository';
import { TransactionRepository } from '../../repositories/abstracts/TransactionRepository';
import { MongoosePayablesRepository } from '../../repositories/implementations/mongoose/payables/MongoosePayablesRepository';
import {
    Payables,
    PayablesSchema,
} from '../../repositories/implementations/mongoose/schemas/payables.schema';
import {
    Transaction,
    TransactionSchema,
} from '../../repositories/implementations/mongoose/schemas/transaction.schema';
import { MongooseTransactionRepository } from '../../repositories/implementations/mongoose/transaction/MongooseTransactionRepository';
import { GenerateCreditCardPayableService } from './use-cases/generate-credit-card-payable/generate-credit-card-payable.service';
import { GenerateDebitCardPayableService } from './use-cases/generate-debit-card-payable/generate-debit-card-payable.service';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Payables.name, schema: PayablesSchema },
        ]),
        MongooseModule.forFeature([
            { name: Transaction.name, schema: TransactionSchema },
        ]),
    ],
    providers: [
        GenerateCreditCardPayableService,
        GenerateDebitCardPayableService,
        {
            provide: PayablesRepository,
            useClass: MongoosePayablesRepository,
        },
        {
            provide: TransactionRepository,
            useClass: MongooseTransactionRepository,
        },
    ],
    exports: [
        GenerateCreditCardPayableService,
        GenerateDebitCardPayableService,
    ],
})
export class PayablesModule {}
