import {
    Controller,
    HttpCode,
    HttpStatus,
    Post,
    UseGuards,
} from '@nestjs/common';
import { IController, returnHandle } from 'src/interfaces/IController';
import { LocalAuthGuard } from 'src/modules/auth/guards/local-auth.guard';
import { LoginUserService } from './login-user.service';

// MUDAR o Http de resposta para 200 (OK) porque por Padrão o Nest com o Decorator
// @Post() retorna 201 (Created) !!!
// OBS: Fazer isso com: @HttpCode(HttpStatus.OK) !!

@Controller('auth')
export class LoginUserController implements IController {
    constructor(private readonly _loginUserService: LoginUserService) {}

    @Post('login')
    @HttpCode(HttpStatus.OK)
    @UseGuards(LocalAuthGuard)
    handle(dataNestDecorator?: object): Promise<returnHandle> {
        const a: any = 'a';

        return a;
    }
}
