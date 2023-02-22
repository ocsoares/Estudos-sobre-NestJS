import { Module } from '@nestjs/common';
import { PayablesRepository } from 'src/repositories/abstracts/PayablesRepository';
import { TransactionRepository } from 'src/repositories/abstracts/TransactionRepository';
import { UserRepository } from 'src/repositories/abstracts/UserRepository';
import { PrismaService } from './prisma-client.service';
import { PrismaUserRepository } from './user/PrismaUserRepository';

@Module({
    imports: [],
    providers: [
        PrismaService,
        {
            provide: UserRepository,
            useClass: PrismaUserRepository,
        },
        // {
        //     provide: PayablesRepository,
        //     useClass: MongoosePayablesRepository,
        // },
        // {
        //     provide: TransactionRepository,
        //     useClass: MongooseTransactionRepository,
        // },
    ],
    exports: [UserRepository],
})
export class PrismaDatabaseModule {}
