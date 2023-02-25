import { Global, Module } from '@nestjs/common';
import { PayablesRepository } from '../../../repositories/abstracts/PayablesRepository';
import { TransactionRepository } from '../../../repositories/abstracts/TransactionRepository';
import { UserRepository } from '../../../repositories/abstracts/UserRepository';
import { PrismaPayablesRepository } from './payables/PrismaPayablesRepository';
import { PrismaService } from './prisma-client.service';
import { PrismaTransactionRepository } from './transaction/PrismaTransactionRepository';
import { PrismaUserRepository } from './user/PrismaUserRepository';

@Global() // Torna esse Módulo GLOBAL, ou seja, quando Importado em QUALQUER LUGAR, importa para TODOS !!!
@Module({
    providers: [
        PrismaService,
        {
            provide: UserRepository,
            useClass: PrismaUserRepository,
        },
        {
            provide: PayablesRepository,
            useClass: PrismaPayablesRepository,
        },
        {
            provide: TransactionRepository,
            useClass: PrismaTransactionRepository,
        },
    ],
    exports: [UserRepository, PayablesRepository, TransactionRepository],
})
export class PrismaDatabaseModule {}
