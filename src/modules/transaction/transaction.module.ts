import { Module } from '@nestjs/common';
import { MakeTransferController } from './use-cases/make-transfer/make-transfer.controller';
import { MakeTransferService } from './use-cases/make-transfer/make-transfer.service';
import { MongooseTransactionRepository } from 'src/repositories/implementations/mongoose/transaction/MongooseTransactionRepository';
import { TransactionRepository } from 'src/repositories/abstracts/TransactionRepository';

@Module({
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
