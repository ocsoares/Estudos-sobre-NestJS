/* eslint-disable @typescript-eslint/naming-convention */

import { BadRequestException, Injectable } from '@nestjs/common';
import { IService } from 'src/interfaces/IService';
import { IPayable } from 'src/models/IPayable';
import { PayablesRepository } from 'src/repositories/abstracts/PayablesRepository';
import { TransactionRepository } from 'src/repositories/abstracts/TransactionRepository';

@Injectable()
export class GenerateDebitCardPayableService implements IService {
    constructor(
        private readonly _generateDebitCardPayableRepository: PayablesRepository,
        private readonly _transactionRepository: TransactionRepository,
    ) {}

    async execute(transfer_id: string): Promise<IPayable> {
        const transfer = await this._transactionRepository.findOneById(
            transfer_id,
        );

        if (!transfer) {
            throw new BadRequestException('Id de transferência inválido !');
        }

        const fivePercentProcessingFee = Number(
            (
                transfer.transfer_amount -
                transfer.transfer_amount * 0.05
            ).toFixed(2),
        );

        const makeDebitCardPayable =
            await this._generateDebitCardPayableRepository.create({
                account_id: transfer.account_id,
                transfer_amount: fivePercentProcessingFee,
                description: transfer.description,
                status: 'paid',
                payment_date: new Date(),
                transfer_id,
            });

        return makeDebitCardPayable;
    }
}
