import { Controller, Get } from '@nestjs/common';
import { IController, returnHandle } from 'src/interfaces/IController';
import { ShowAllAccountTransactionsService } from './show-all-account-transactions.service';
import { CurrentUser } from 'src/modules/auth/decorators/current-user.decorator';
import { IReturnUser } from 'src/interfaces/IReturnUser';

@Controller('show-all-account-transactions')
export class ShowAllAccountTransactionsController implements IController {
    constructor(
        private readonly _showAllAccountTransactionsService: ShowAllAccountTransactionsService,
    ) {}

    @Get('transaction')
    async handle(@CurrentUser() user: IReturnUser): Promise<returnHandle> {
        const transactions =
            await this._showAllAccountTransactionsService.execute(user.id);

        return {
            message: 'Suas transações foram encontradas com sucesso !',
            data: transactions,
        };
    }
}
