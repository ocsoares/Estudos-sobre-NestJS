import { Module } from '@nestjs/common';
import { MakeTransferController } from './use-cases/make-transfer/make-transfer.controller';
import { MakeTransferService } from './use-cases/make-transfer/make-transfer.service';
import { MongooseTransactionRepository } from '../../repositories/implementations/mongoose/transaction/MongooseTransactionRepository';
import { TransactionRepository } from '../../repositories/abstracts/TransactionRepository';
import { MongooseModule } from '@nestjs/mongoose';
import {
    Transaction,
    TransactionSchema,
} from '../../repositories/implementations/mongoose/schemas/transaction.schema';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Transaction.name, schema: TransactionSchema },
        ]),
    ],
    controllers: [MakeTransferController],
    providers: [
        MakeTransferService,
        {
            provide: TransactionRepository,
            useClass: MongooseTransactionRepository,
        },
    ],
})
export class TransactionModule {}
