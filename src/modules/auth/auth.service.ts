import { Injectable } from '@nestjs/common';

interface IAuthService {
    validateUser(email: string, password: string): Promise<any>; // VER o Retorno disso...
}

@Injectable()
export class AuthService implements IAuthService {
    async validateUser(email: string, password: string): Promise<any> {
        return 'a';
    }
}
