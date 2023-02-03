import {
    Controller,
    HttpCode,
    HttpStatus,
    Post,
    UseGuards,
} from '@nestjs/common';
import { IController, returnHandle } from 'src/interfaces/IController';
import { LocalAuthGuard } from 'src/modules/auth/guards/local-auth.guard';

// Como vou usar a Autenticação do Módulo Auth, NÃO preciso usar o LoginUserService aqui no
// Constructor desse Controller, porque o Auth JÁ TEM um AuthService para a Validação do
// Usuário !!!

@Controller('auth')
export class LoginUserController implements IController {
    @Post('login')
    @HttpCode(HttpStatus.OK)
    @UseGuards(LocalAuthGuard)

    // VER como colocar para VALIDAR o Body !!!
    handle(dataNestDecorator?: object): Promise<returnHandle> {
        const a: any = 'a';

        return a;
    }
}
