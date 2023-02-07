import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserRepository } from '../../repositories/abstracts/UserRepository';
import { MongooseUserRepository } from '../../repositories/implementations/mongoose/user/MongooseUserRepository';
import { CreateUserController } from './use-cases/create-user/create-user.controller';
import { CreateUserService } from './use-cases/create-user/create-user.service';
import {
    User,
    UserSchema,
} from '../../repositories/implementations/mongoose/schemas/user.schema';
import { LoginUserController } from './use-cases/login-user/login-user.controller';
import { LoginUserService } from './use-cases/login-user/login-user.service';
import { JwtModule } from '@nestjs/jwt';

// OBS: O JwtModule TEM que ser Async, porque se não for NÃO carrega as Variáveis de Ambiente !!!

@Module({
    imports: [
        MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
        JwtModule.registerAsync({
            useFactory: async () => ({
                secret: process.env.JWT_SECRET,
                signOptions: { expiresIn: process.env.JWT_EXPIRATION },
            }),
        }),
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
    exports: [UserRepository],
})
export class UserModule {}
