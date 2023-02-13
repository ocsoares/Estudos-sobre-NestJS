/* eslint-disable @typescript-eslint/naming-convention */

import { Injectable } from '@nestjs/common';
import { IService } from 'src/interfaces/IService';
import { TransactionRepository } from 'src/repositories/abstracts/TransactionRepository';
import { IReturnTransfer } from '../make-transfer/interfaces/IReturnTransfer';

@Injectable()
export class ShowAllAccountTransactionsService implements IService {
    constructor(
        private readonly _showAllAccountTransactionsRepository: TransactionRepository,
    ) {}

    // O Id vai ser passado pelo JWT, que é protegido por um Guard, então se o Id NÃO existir, o próprio
    // Guard vai cuidar disso !!!
    async execute(id: string): Promise<IReturnTransfer[]> {
        // FAZER para quando NÃO tiver nenhuma Transação, retornar uma Mensagem falando que ainda não
        // tem Transações feitas...
        const transactions =
            await this._showAllAccountTransactionsRepository.findAllById(id);

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
