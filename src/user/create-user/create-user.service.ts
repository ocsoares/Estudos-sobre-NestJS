import { Injectable } from '@nestjs/common';
import { IService } from 'src/interfaces/IService';
import { IUser } from 'src/models/IUser';
import { UserRepository } from 'src/repositories/abstracts/UserRepository';

// Essa Classe RECEBE no seu constructor os métodos do Banco de Dados por contrato (UserRepository) e
// essa classe será Injetada no constructor do Controller !!

// OBS: PRECISA Injetar algum Banco de Dados nesse Repositório (UserRepository) no MÓDULO responsável por
// ESSA Pasta e em providers:
// {
//     provide: Repositório de CONTRATO com os Métodos,
//     useClass: Repositório do Banco de Dados REAL
// }

@Injectable()
export class CreateUserService implements IService {
    constructor(private readonly _createUserRepository: UserRepository) {}

    async execute(data: IUser) {
        // PROCURAR se existe...

        const createUser = await this._createUserRepository.create(data);

        return createUser;
    }
}
