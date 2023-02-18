import { Controller, Get } from '@nestjs/common';
import { IController, returnHandle } from '../../../../interfaces/IController';
import { CurrentUser } from '../../../../modules/auth/decorators/current-user.decorator';
import { ShowAllPayablesService } from './show-all-payables.service';
import { IReturnUser } from '../../../../interfaces/IReturnUser';

@Controller()
export class ShowAllPayablesController implements IController {
    constructor(
        private readonly _showAllPayablesService: ShowAllPayablesService,
    ) {}

    @Get('payables')
    async handle(@CurrentUser() user: IReturnUser): Promise<returnHandle> {
        const payables = await this._showAllPayablesService.execute(user.id);

        return {
            message: 'Seus payables foram encontrados com sucesso !',
            data: payables,
        };
    }
}
