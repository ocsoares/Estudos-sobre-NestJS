import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserRepository } from 'src/repositories/abstracts/UserRepository';
import { MongooseUserRepository } from 'src/repositories/implementations/mongoose/MongooseUserRepository';
import { CreateUserController } from './create-user/create-user.controller';
import { CreateUserService } from './create-user/create-user.service';
import { FindUserController } from './find-user/find-user.controller';
import { FindUserService } from './find-user/find-user.service';
import {
    User,
    UserSchema,
} from 'src/repositories/implementations/mongoose/schemas/user.schema';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    ],
    controllers: [CreateUserController, FindUserController],
    providers: [
        CreateUserService,
        FindUserService,
        {
            provide: UserRepository, // Repositório de CONTRATO com os Métodos !!
            useClass: MongooseUserRepository, // Repositório do Banco de Dados REAL !!
        },
    ],
})
export class UserModule {}
