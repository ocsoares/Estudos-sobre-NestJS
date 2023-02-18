/* eslint-disable @typescript-eslint/naming-convention */

import { BadRequestException, HttpException, Injectable } from '@nestjs/common';
import { IReturnPayable } from 'src/interfaces/IReturnPayable';
import { IService } from 'src/interfaces/IService';
import { PayablesRepository } from 'src/repositories/abstracts/PayablesRepository';
import { UserRepository } from 'src/repositories/abstracts/UserRepository';

@Injectable()
export class ShowAllCreditPayablesService implements IService {
    constructor(
        private readonly _showAllCreditPayablesRepository: PayablesRepository,
        private readonly _userRepository: UserRepository,
    ) {}

    async execute(account_id: string): Promise<IReturnPayable[]> {
        const userStillExists = await this._userRepository.findById(account_id);

        if (!userStillExists) {
            throw new BadRequestException(
                'Não foi possível encontrar o usuário pelo id fornecido !',
            );
        }

        const creditPayables =
            await this._showAllCreditPayablesRepository.findAllCreditPayablesByAccountId(
                account_id,
            );

        if (creditPayables.length === 0) {
            throw new HttpException(
                'Você ainda não tem nenhum payable de crédito !',
                200,
            );
        }

        const mainInformation = creditPayables.map(
            (prop) =>
                <IReturnPayable>{
                    transfer_amount: prop.transfer_amount,
                    description: prop.description,
                    status: prop.status,
                    payment_date: prop.payment_date,
                },
        );

        return mainInformation;
    }
}
