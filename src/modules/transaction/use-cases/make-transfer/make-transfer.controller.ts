/* eslint-disable @typescript-eslint/naming-convention */

import { Body, Controller, Post, Request } from '@nestjs/common';
import { Request as ExpressRequest } from 'express';
import { IController, returnHandle } from 'src/interfaces/IController';
import { MakeTransferDTO } from './dtos/MakeTransferDTO';
import { MakeTransferService } from './make-transfer.service';

@Controller()
export class MakeTransferController implements IController {
    constructor(private readonly _makeTransferService: MakeTransferService) {}

    @Post('transaction')
    async handle(
        @Body() body: MakeTransferDTO,
        @Request() req: ExpressRequest,
    ): Promise<returnHandle> {
        const [, token] = req.headers.authorization.split(' ');

        const makeTransfer = await this._makeTransferService.execute({
            account_id: token,
            ...body,
        });

        return {
            message: 'Transferência realizada com sucesso !',
            data: makeTransfer,
        };
    }
}
