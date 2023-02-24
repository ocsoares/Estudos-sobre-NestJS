import { Module } from '@nestjs/common';
import { MakeTransferController } from './use-cases/make-transfer/make-transfer.controller';
import { MakeTransferService } from './use-cases/make-transfer/make-transfer.service';
import { ShowAllAccountTransactionsController } from './use-cases/show-all-account-transactions/show-all-account-transactions.controller';
import { ShowAllAccountTransactionsService } from './use-cases/show-all-account-transactions/show-all-account-transactions.service';
import { PayablesModule } from '../payables/payables.module';
import { GenerateCreditCardPayableService } from '../payables/use-cases/generate-credit-card-payable/generate-credit-card-payable.service';
import { GenerateDebitCardPayableService } from '../payables/use-cases/generate-debit-card-payable/generate-debit-card-payable.service';
// import { MongooseDatabaseModule } from '../../repositories/implementations/mongoose/mongoose-database.module';
import { PrismaDatabaseModule } from '../../repositories/implementations/prisma/prisma-database.module';

@Module({
    imports: [PrismaDatabaseModule, PayablesModule],
    controllers: [MakeTransferController, ShowAllAccountTransactionsController],
    providers: [
        MakeTransferService,
        ShowAllAccountTransactionsService,

        // Adicionando esses Services e esses Repositorys, MESMO já IMPORTADOS de
        // PayablesModule, fez parar o bug dos Métodos NÃO serem Chamados nos
        // Testes !!! <<<
        GenerateCreditCardPayableService,
        GenerateDebitCardPayableService,
    ],
})
export class TransactionModule {}
