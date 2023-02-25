import { Module } from '@nestjs/common';
import { GenerateCreditCardPayableService } from './use-cases/generate-credit-card-payable/generate-credit-card-payable.service';
import { GenerateDebitCardPayableService } from './use-cases/generate-debit-card-payable/generate-debit-card-payable.service';
import { ShowAllPayablesController } from './use-cases/show-all-payables/show-all-payables.controller';
import { ShowAllPayablesService } from './use-cases/show-all-payables/show-all-payables.service';
import { ShowAllCreditPayablesService } from './use-cases/show-all-credit-payables/show-all-credit-payables.service';
import { ShowAllCreditPayablesController } from './use-cases/show-all-credit-payables/show-all-credit-payables.controller';
import { ShowAllDebitPayablesController } from './use-cases/show-all-debit-payables/show-all-debit-payables.controller';
import { ShowAllDebitPayablesService } from './use-cases/show-all-debit-payables/show-all-debit-payables.service';

@Module({
    controllers: [
        ShowAllPayablesController,
        ShowAllCreditPayablesController,
        ShowAllDebitPayablesController,
    ],
    providers: [
        GenerateCreditCardPayableService,
        GenerateDebitCardPayableService,
        ShowAllPayablesService,
        ShowAllCreditPayablesService,
        ShowAllDebitPayablesService,
    ],
    exports: [
        GenerateCreditCardPayableService,
        GenerateDebitCardPayableService,
    ],
})
export class PayablesModule {}
