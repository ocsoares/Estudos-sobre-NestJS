import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { PayablesRepository } from '../../../repositories/abstracts/PayablesRepository';
import { TransactionRepository } from '../../../repositories/abstracts/TransactionRepository';
import { UserRepository } from '../../../repositories/abstracts/UserRepository';
import { MongoosePayablesRepository } from './payables/MongoosePayablesRepository';
import { Payables, PayablesSchema } from './schemas/payables.schema';
import { Transaction, TransactionSchema } from './schemas/transaction.schema';
import { User, UserSchema } from './schemas/user.schema';
import { MongooseTransactionRepository } from './transaction/MongooseTransactionRepository';
import { MongooseUserRepository } from './user/MongooseUserRepository';

@Global() // Torna esse Módulo GLOBAL, ou seja, quando Importado em QUALQUER LUGAR, importa para TODOS !!!
@Module({
    imports: [
        ConfigModule.forRoot(), // Ativa as Variáveis de Ambiente DEFAULT (sem nada nos ()) !!
        MongooseModule.forRoot(process.env.ATLAS_URL_CONNECTION),
        MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
        MongooseModule.forFeature([
            { name: Transaction.name, schema: TransactionSchema },
        ]),
        MongooseModule.forFeature([
            { name: Payables.name, schema: PayablesSchema },
        ]),
    ],
    providers: [
        {
            provide: UserRepository,
            useClass: MongooseUserRepository,
        },
        {
            provide: PayablesRepository,
            useClass: MongoosePayablesRepository,
        },
        {
            provide: TransactionRepository,
            useClass: MongooseTransactionRepository,
        },
    ],
    exports: [UserRepository, PayablesRepository, TransactionRepository],
})
export class MongooseDatabaseModule {}
