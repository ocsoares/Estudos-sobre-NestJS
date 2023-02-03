import { BadRequestException, Injectable } from '@nestjs/common';
import { IService } from 'src/interfaces/IService';
import { UserRepository } from 'src/repositories/abstracts/UserRepository';
import { LoginUserDTO } from './dtos/LoginUserDTO';
import * as bcript from 'bcrypt';

@Injectable()
export class LoginUserService implements IService {
    constructor(private readonly _loginUserRepository: UserRepository) {}

    async execute(data?: LoginUserDTO): Promise<string> {
        const isValidEmail = await this._loginUserRepository.findByEmail(
            data.email,
        );

        if (!isValidEmail) {
            throw new BadRequestException('Email ou senha incorreto(s) !');
        }

        const isValidPassword = await bcript.compare(
            data.password,
            isValidEmail.password,
        );

        if (!isValidEmail) {
            throw new BadRequestException('Email ou senha incorreto(s) !');
        }

        // Fazer JWT !!!

        return 'a';
    }
}
