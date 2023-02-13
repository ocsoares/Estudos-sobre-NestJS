/* eslint-disable @typescript-eslint/naming-convention */

import { BadRequestException, Injectable } from '@nestjs/common';
import { IService } from 'src/interfaces/IService';
import { ITransaction } from 'src/models/ITransaction';
import { UserRepository } from 'src/repositories/abstracts/UserRepository';
import { TransactionRepository } from '../../../../repositories/abstracts/TransactionRepository';
import { IReturnTransfer } from './interfaces/IReturnTransfer';

@Injectable()
export class MakeTransferService implements IService {
    constructor(
        private readonly _makeTransferRepository: TransactionRepository,
        private readonly _userRepository: UserRepository,
    ) {}

    // Id vai ser colocado no Controller, com o ID armazenado no JWT !!
    async execute(data: ITransaction): Promise<IReturnTransfer> {
        const { transfer_amount, card_number, account_id } = data;

        const userStillExists = await this._userRepository.findById(account_id);

        if (!userStillExists) {
            throw new BadRequestException(
                'Não foi possível encontrar o usuário pelo id fornecido !',
            );
        }

        const fixTransferAmountTwoDecimalPlaces = Number(
            transfer_amount.toFixed(2),
        );
        const lastForDigitsCard = card_number.slice(12, 16);

        const makeTransfer = await this._makeTransferRepository.create({
            ...data,
            transfer_amount: fixTransferAmountTwoDecimalPlaces,
            card_number: `...-${lastForDigitsCard}`,
        });

        const mainInformationTransfer: IReturnTransfer = {
            date: makeTransfer.date,
            transfer_amount: makeTransfer.transfer_amount,
            description: makeTransfer.description,
            payment_method: makeTransfer.payment_method,
            card_number: makeTransfer.card_number,
            card_holder: makeTransfer.card_holder,
        };

        return mainInformationTransfer;
    }
}
