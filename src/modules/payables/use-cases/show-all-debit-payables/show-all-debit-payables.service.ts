

import { BadRequestException, HttpException, Injectable } from '@nestjs/common';
import { IReturnPayable } from '../../../../interfaces/IReturnPayable';
import { IService } from '../../../../interfaces/IService';
import { PayablesRepository } from '../../../../repositories/abstracts/PayablesRepository';
import { UserRepository } from '../../../../repositories/abstracts/UserRepository';

@Injectable()
export class ShowAllDebitPayablesService implements IService {
    constructor(
        private readonly _showAllDebitPayablesRepository: PayablesRepository,
        private readonly _userRepository: UserRepository,
    ) {}

    async execute(account_id: string): Promise<IReturnPayable[]> {
        const userStillExists = await this._userRepository.findById(account_id);

        if (!userStillExists) {
            throw new BadRequestException(
                'Não foi possível encontrar o usuário pelo id fornecido !',
            );
        }

        const debitPayables =
            await this._showAllDebitPayablesRepository.findAllDebitPayablesByAccountId(
                account_id,
            );

        if (debitPayables.length === 0) {
            throw new HttpException(
                'Você ainda não tem nenhum payable de débito !',
                200,
            );
        }

        const mainInformation = debitPayables.map(
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
