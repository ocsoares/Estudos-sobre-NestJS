import { Controller, Get } from '@nestjs/common';
import { IController, returnHandle } from 'src/interfaces/IController';
import { IReturnUser } from 'src/interfaces/IReturnUser';
import { CurrentUser } from 'src/modules/auth/decorators/current-user.decorator';
import { ShowAllCreditPayablesService } from './show-all-credit-payables.service';

@Controller('')
export class ShowAllCreditPayablesController implements IController {
    constructor(
        private readonly _showAllCreditPayablesService: ShowAllCreditPayablesService,
    ) {}

    @Get('payable/credit')
    async handle(@CurrentUser() user: IReturnUser): Promise<returnHandle> {
        const creditPayables = await this._showAllCreditPayablesService.execute(
            user.id,
        );

        return {
            message: 'Seus payables de crédito foram encontrados !',
            data: creditPayables,
        };
    }
}
