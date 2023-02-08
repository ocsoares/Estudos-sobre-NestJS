import { Module } from '@nestjs/common';
import { MakeTransferController } from './use-cases/make-transfer/make-transfer.controller';
import { MakeTransferService } from './use-cases/make-transfer/make-transfer.service';
import { MongooseTransactionRepository } from 'src/repositories/implementations/mongoose/transaction/MongooseTransactionRepository';
import { TransactionRepository } from 'src/repositories/abstracts/TransactionRepository';
import { MongooseModule } from '@nestjs/mongoose';
import {
    Transaction,
    TransactionSchema,
} from 'src/repositories/implementations/mongoose/schemas/transaction.schema';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

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
            provide: APP_GUARD,
            useClass: JwtAuthGuard,
        },
        {
            provide: TransactionRepository,
            useClass: MongooseTransactionRepository,
        },
    ],
})
export class TransactionModule {}
