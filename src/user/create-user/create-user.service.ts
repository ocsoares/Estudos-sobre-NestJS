import { BadRequestException, Injectable } from '@nestjs/common';
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
        const userAlreadyExists = await this._createUserRepository.findByName(
            data.name,
        );

        if (userAlreadyExists) {
            throw new BadRequestException(
                'Já existe um usuário cadastrado com esse nome !',
            );
        }

        const emailAlreadyExists = await this._createUserRepository.findByEmail(
            data.email,
        );

        if (emailAlreadyExists) {
            throw new BadRequestException(
                'Já existe um usuário cadastrado com esse email !',
            );
        }

        const createUser = await this._createUserRepository.create(data);

        return createUser;
    }
}
