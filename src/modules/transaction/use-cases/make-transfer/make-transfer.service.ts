/* eslint-disable @typescript-eslint/naming-convention */

import { Injectable } from '@nestjs/common';
import { IService } from 'src/interfaces/IService';
import { ITransaction } from 'src/models/ITransaction';
import { TransactionRepository } from 'src/repositories/abstracts/TransactionRepository';

@Injectable()
export class MakeTransferService implements IService {
    constructor(
        private readonly _makeTransferRepository: TransactionRepository,
    ) {}

    // TALVEZ vou ter que usar o @Request aqui para pegar o ID do JWT...
    async execute(data: ITransaction): Promise<ITransaction> {
        const { transfer_amount, card_number } = data;

        const fixTransferAmountTwoDecimalPlaces = Number(
            transfer_amount.toFixed(2),
        );
        const lastForDigitsCard = card_number.slice(12, 16);

        return 'a' as any;
    }
}
