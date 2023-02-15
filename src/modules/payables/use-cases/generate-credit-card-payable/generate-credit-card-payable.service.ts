/* eslint-disable @typescript-eslint/naming-convention */

import { BadRequestException, Injectable } from '@nestjs/common';
import { IService } from 'src/interfaces/IService';
import { IPayable } from 'src/models/IPayable';
import { PayablesRepository } from 'src/repositories/abstracts/PayablesRepository';
import { TransactionRepository } from 'src/repositories/abstracts/TransactionRepository';

@Injectable()
export class GenerateCreditCardPayableService implements IService {
    constructor(
        private readonly _generateCreditCardPayableRepository: PayablesRepository,
        private readonly _transactionRepository: TransactionRepository,
    ) {}

    async execute(transfer_id: string): Promise<IPayable> {
        const transfer = await this._transactionRepository.findOneById(
            transfer_id,
        );

        if (!transfer_id) {
            throw new BadRequestException('Id de transferência inválido !');
        }

        const currentDate = new Date();
        const currentDateAfterThirtyDays = new Date(
            currentDate.setDate(currentDate.getDate() + 30),
        );

        const threePercentProcessingFee = Number(
            (
                transfer.transfer_amount -
                transfer.transfer_amount * 0.03
            ).toFixed(2),
        );

        const makeCreditCardPayable =
            await this._generateCreditCardPayableRepository.credit({
                account_id: transfer.account_id,
                transfer_amount: threePercentProcessingFee,
                description: transfer.description,
                status: 'waiting_funds',
                payment_date: currentDateAfterThirtyDays,
                transfer_id,
            });

        return makeCreditCardPayable;
    }
}
