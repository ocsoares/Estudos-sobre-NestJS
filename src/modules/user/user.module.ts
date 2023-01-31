import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserRepository } from '../../repositories/abstracts/UserRepository';
import { MongooseUserRepository } from '../../repositories/implementations/mongoose/MongooseUserRepository';
import { CreateUserController } from './use-cases/create-user/create-user.controller';
import { CreateUserService } from './use-cases/create-user/create-user.service';
import {
    User,
    UserSchema,
} from '../../repositories/implementations/mongoose/schemas/user.schema';
import { LoginUserController } from './use-cases/login-user/login-user.controller';
import { LoginUserService } from './use-cases/login-user/login-user.service';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    ],
    controllers: [CreateUserController, LoginUserController],
    providers: [
        CreateUserService,
        {
            provide: UserRepository, // Repositório de CONTRATO com os Métodos !!
            useClass: MongooseUserRepository, // Repositório do Banco de Dados REAL !!
        },
        LoginUserService,
    ],
})
export class UserModule {}
