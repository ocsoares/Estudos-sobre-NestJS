import { BadRequestException, Injectable } from '@nestjs/common';
import { IService } from 'src/interfaces/IService';
import { IUser } from 'src/models/IUser';
import { UserRepository } from '../../../../repositories/abstracts/UserRepository';
import { CreateUserDTO } from './dtos/CreateUserDTO';
import * as bcrypt from 'bcrypt';

@Injectable()
export class CreateUserService implements IService {
    constructor(private readonly _createUserRepository: UserRepository) {}

    async execute(data: IUser): Promise<CreateUserDTO> {
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

        const createUser = await this._createUserRepository.create({
            name: data.name,
            email: data.email,
            password: await bcrypt.hash(data.password, 10),
        });

        const mainInformationUser: CreateUserDTO = {
            name: createUser.name,
            email: createUser.email,
            password: createUser.password,
        };

        return mainInformationUser;
    }
}
