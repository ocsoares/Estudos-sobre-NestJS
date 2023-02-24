import { Body, Controller, Post } from '@nestjs/common';
import { IController, returnHandle } from 'src/interfaces/IController';
import { IReturnUser } from 'src/interfaces/IReturnUser';
import { CurrentUser } from '../../../../modules/auth/decorators/current-user.decorator';
import { MakeTransferDTO } from './dtos/MakeTransferDTO';
import { MakeTransferService } from './make-transfer.service';

@Controller()
export class MakeTransferController implements IController {
    constructor(private readonly _makeTransferService: MakeTransferService) {}

    @Post('transaction')
    async handle(
        @Body() body: MakeTransferDTO,
        @CurrentUser() user: IReturnUser,
    ): Promise<returnHandle> {
        const makeTransfer = await this._makeTransferService.execute({
            account_id: user.id,
            ...body,
        });

        return {
            message: 'Transferência realizada com sucesso !',
            data: makeTransfer,
        };
    }
}
