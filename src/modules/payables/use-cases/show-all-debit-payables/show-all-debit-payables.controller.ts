import { Controller, Get } from '@nestjs/common';
import { IController, returnHandle } from '../../../../interfaces/IController';
import { IReturnUser } from '../../../../interfaces/IReturnUser';
import { CurrentUser } from '../../../../modules/auth/decorators/current-user.decorator';
import { ShowAllDebitPayablesService } from './show-all-debit-payables.service';

@Controller('')
export class ShowAllDebitPayablesController implements IController {
    constructor(
        private readonly _showAllDebitPayablesService: ShowAllDebitPayablesService,
    ) {}

    @Get('payables/debit')
    async handle(@CurrentUser() user: IReturnUser): Promise<returnHandle> {
        const debitPayables = await this._showAllDebitPayablesService.execute(
            user.id,
        );

        return {
            message: 'Seus payables de débito foram encontrados com sucesso !',
            data: debitPayables,
        };
    }
}
