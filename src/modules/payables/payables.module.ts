import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PayablesRepository } from 'src/repositories/abstracts/PayablesRepository';
import { TransactionRepository } from 'src/repositories/abstracts/TransactionRepository';
import { MongoosePayablesRepository } from 'src/repositories/implementations/mongoose/payables/MongoosePayablesRepository';
import {
    Payables,
    PayablesSchema,
} from 'src/repositories/implementations/mongoose/schemas/payables.schema';
import {
    Transaction,
    TransactionSchema,
} from 'src/repositories/implementations/mongoose/schemas/transaction.schema';
import { MongooseTransactionRepository } from 'src/repositories/implementations/mongoose/transaction/MongooseTransactionRepository';
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
        {
            provide: PayablesRepository,
            useClass: MongoosePayablesRepository,
        },
        {
            provide: TransactionRepository,
            useClass: MongooseTransactionRepository,
        },
        GenerateDebitCardPayableService,
    ],
    exports: [
        GenerateCreditCardPayableService,
        GenerateDebitCardPayableService,
    ],
})
export class PayablesModule {}
