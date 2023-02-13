/* eslint-disable @typescript-eslint/naming-convention */

import { BadRequestException, HttpException, Injectable } from '@nestjs/common';
import { IService } from 'src/interfaces/IService';
import { TransactionRepository } from 'src/repositories/abstracts/TransactionRepository';
import { UserRepository } from 'src/repositories/abstracts/UserRepository';
import { IReturnTransfer } from '../make-transfer/interfaces/IReturnTransfer';

@Injectable()
export class ShowAllAccountTransactionsService implements IService {
    constructor(
        private readonly _showAllAccountTransactionsRepository: TransactionRepository,
        private readonly _userRepository: UserRepository,
    ) {}

    async execute(id: string): Promise<IReturnTransfer[]> {
        const userStillExists = await this._userRepository.findById(id);

        if (!userStillExists) {
            throw new BadRequestException(
                'Não foi possível encontrar o usuário pelo id fornecido !',
            );
        }

        const transactions =
            await this._showAllAccountTransactionsRepository.findAllById(id);

        if (transactions.length === 0) {
            throw new HttpException(
                'Você ainda não realizou nenhuma transação !',
                200,
            );
        }

        const mainTransactionsInformations = transactions.map(
            (prop) =>
                <IReturnTransfer>{
                    date: prop.date,
                    transfer_amount: prop.transfer_amount,
                    description: prop.description,
                    payment_method: prop.payment_method,
                    card_number: prop.card_number,
                    card_holder: prop.card_holder,
                },
        );

        return mainTransactionsInformations;
    }
}
