import { Controller } from '@nestjs/common';

// MUDAR o Http de resposta para 200 (OK) porque por Padrão o Nest com o Decorator
// @Post() retorna 201 (Created) !!!
// OBS: Fazer isso com: @HttpCode(HttpStatus.OK) !!

@Controller('login-user')
export class LoginUserController {}
