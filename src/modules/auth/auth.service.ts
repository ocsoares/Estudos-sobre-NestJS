import { Injectable } from '@nestjs/common';
import { UserRepository } from 'src/repositories/abstracts/UserRepository';
import * as bcrypt from 'bcrypt';
import { IUser } from 'src/models/IUser';

interface IAuthService {
    validateUser(email: string, password: string): Promise<IUser>; // VER o Retorno disso...
}

// Colocar um Throw de Error aqui nesse Service, porque no local auth guard está configurado para o
// Método handleRequest Tratar esse Erro com throw new UnauthorizedException(), com a Mensagem passada AQUI
// no Throw de Error !!!

@Injectable()
export class AuthService implements IAuthService {
    constructor(private readonly _authUserRepository: UserRepository) {}

    async validateUser(email: string, password: string): Promise<IUser> {
        const user = await this._authUserRepository.findByEmail(email);

        console.log('USER:', user);

        if (!user) {
            throw new Error('Email ou senha incorreto(s) !');
        }

        const isValidPassword = await bcrypt.compare(password, user.password);

        console.log('isValidPassword:', isValidPassword);

        if (!isValidPassword) {
            throw new Error('Email ou senha incorreto(s) !');
        }

        // NÃO retornar a Senha, mesmo que Criptografada !!!
        return {
            ...user,
            password: undefined,
        };
    }
}
