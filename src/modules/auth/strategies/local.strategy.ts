import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../auth.service';

// Esse LocalStrategy pega as Informações do Body da Rota (vou usar no Login) e repassa
// pro Método validate, que é o responsável ter a lógica de Validar um Usuário ou não !!!

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
    constructor(private _authService: AuthService) {
        super({ usernameField: 'email' });
    }

    validate(email: string, password: string) {
        return this._authService.validateUser(email, password);
    }
}
