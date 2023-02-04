import {
    Controller,
    HttpCode,
    HttpStatus,
    Post,
    Request,
    UseGuards,
} from '@nestjs/common';
import { IController, returnHandle } from 'src/interfaces/IController';
import { LocalAuthGuard } from 'src/modules/auth/guards/local-auth.guard';
import { IAuthRequest } from 'src/modules/auth/types/IAuthRequest';
import { LoginUserService } from './login-user.service';

@Controller('auth')
export class LoginUserController implements IController {
    constructor(private readonly _loginUserService: LoginUserService) {}

    @Post('login')
    @HttpCode(HttpStatus.OK)
    @UseGuards(LocalAuthGuard)
    async handle(@Request() req: IAuthRequest): Promise<returnHandle> {
        console.log('REQ USER:', req.user);

        // o req.user.id NÃO está definido, então NÃO está passando para o JWT, porque o id tá vindo como _id, ARRUMAR ISSO !!!
        const JWT = await this._loginUserService.execute(req.user);

        return {
            message: 'Login realizado com sucesso !',
            data: JWT,
        };
    }
}
