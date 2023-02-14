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
import { ShowAllAccountTransactionsController } from './use-cases/show-all-account-transactions/show-all-account-transactions.controller';
import { ShowAllAccountTransactionsService } from './use-cases/show-all-account-transactions/show-all-account-transactions.service';
import { UserRepository } from '../../repositories/abstracts/UserRepository';
import { MongooseUserRepository } from '../../repositories/implementations/mongoose/user/MongooseUserRepository';
import {
    User,
    UserSchema,
} from '../../repositories/implementations/mongoose/schemas/user.schema';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Transaction.name, schema: TransactionSchema },
        ]),
        MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    ],
    controllers: [MakeTransferController, ShowAllAccountTransactionsController],
    providers: [
        MakeTransferService,
        {
            provide: TransactionRepository,
            useClass: MongooseTransactionRepository,
        },
        {
            provide: UserRepository,
            useClass: MongooseUserRepository,
        },
        ShowAllAccountTransactionsService,
    ],
})
export class TransactionModule {}
