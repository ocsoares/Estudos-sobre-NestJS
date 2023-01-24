import { Body, Controller, Post } from '@nestjs/common';
import { IController, returnHandle } from 'src/interfaces/IController';
import { CreateUserService } from './create-user.service';
import { ICreateUserBody } from './dtos/ICreateUserBody';

// Essa Classe recebe em seu constructor o Service que contém os Métodos e verificações para
// criar um Usuário !!

// PESQUISAR como fazer TODOS os Controllers de um Módulo começar com alguma string Específicada !!
@Controller('auth')
export class CreateUserController implements IController {
    constructor(private readonly _createUserService: CreateUserService) {}

    @Post('register')
    async handle(@Body() body: ICreateUserBody): Promise<returnHandle> {
        const createUser = await this._createUserService.execute(body);

        // Retorna AUTOMATICAMENTE em Json !!
        return {
            message: 'Usuário criado com sucesso !',
            data: createUser,
        };
    }
}
