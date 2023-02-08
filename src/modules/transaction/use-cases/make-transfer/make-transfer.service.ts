/* eslint-disable @typescript-eslint/naming-convention */

import { Injectable } from '@nestjs/common';
import { IService } from 'src/interfaces/IService';
import { ITransaction } from 'src/models/ITransaction';
import { TransactionRepository } from 'src/repositories/abstracts/TransactionRepository';
import { IReturnTransfer } from './interfaces/IReturnTransfer';

@Injectable()
export class MakeTransferService implements IService {
    constructor(
        private readonly _makeTransferRepository: TransactionRepository,
    ) {}

    // Vou ter que pegar o JWT (account_id) passado no Authentication de alguma forma no Controller !!!
    async execute(data: ITransaction): Promise<IReturnTransfer> {
        const { transfer_amount, card_number } = data;

        const fixTransferAmountTwoDecimalPlaces = Number(
            transfer_amount.toFixed(2),
        );
        const lastForDigitsCard = card_number.slice(12, 16);

        const makeTransfer = await this._makeTransferRepository.create({
            ...data,
            transfer_amount: fixTransferAmountTwoDecimalPlaces,
            card_number: lastForDigitsCard,
        });

        const mainInformationTransfer: IReturnTransfer = {
            date: makeTransfer.date,
            transfer_amount: makeTransfer.transfer_amount,
            description: makeTransfer.description,
            payment_method: makeTransfer.payment_method,
            card_number: `....-${makeTransfer.card_number}`,
            card_holder: makeTransfer.card_holder,
        };

        return mainInformationTransfer;
    }
}
