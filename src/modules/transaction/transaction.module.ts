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
import { PayablesModule } from '../payables/payables.module';
import {
    Payables,
    PayablesSchema,
} from '../../repositories/implementations/mongoose/schemas/payables.schema';
import { PayablesRepository } from '../../repositories/abstracts/PayablesRepository';
import { MongoosePayablesRepository } from '../../repositories/implementations/mongoose/payables/MongoosePayablesRepository';
import { GenerateCreditCardPayableService } from '../payables/use-cases/generate-credit-card-payable/generate-credit-card-payable.service';
import { GenerateDebitCardPayableService } from '../payables/use-cases/generate-debit-card-payable/generate-debit-card-payable.service';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Transaction.name, schema: TransactionSchema },
        ]),
        MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
        MongooseModule.forFeature([
            { name: Payables.name, schema: PayablesSchema },
        ]),
        PayablesModule,
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

        // Adicionando esses Services e esses Repositorys, MESMO já IMPORTADOS de
        // PayablesModule, fez parar o bug dos Métodos NÃO serem Chamados nos
        // Testes !!! <<<
        GenerateCreditCardPayableService,
        GenerateDebitCardPayableService,
        {
            provide: PayablesRepository,
            useClass: MongoosePayablesRepository,
        },
    ],
})
export class TransactionModule {}
