import { Module } from '@nestjs/common';
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

@Module({
    imports: [
        // NÃO coloquei a conexão do Mongoose aqui porque como esse Módulo está importado DENTRO dos
        // Módulos da Aplicação (User, Transation, etc...) isso iria fazer com que os Testes Conectassem
        // NESSE Banco de Dados AQUI, ao invés do In Memory !!!
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
