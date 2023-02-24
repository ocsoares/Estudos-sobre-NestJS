import { Module } from '@nestjs/common';
import { CreateUserController } from './use-cases/create-user/create-user.controller';
import { CreateUserService } from './use-cases/create-user/create-user.service';
import { LoginUserController } from './use-cases/login-user/login-user.controller';
import { LoginUserService } from './use-cases/login-user/login-user.service';
import { JwtModule } from '@nestjs/jwt';
// import { MongooseDatabaseModule } from '../../repositories/implementations/mongoose/mongoose-database.module';
import { PrismaDatabaseModule } from '../../repositories/implementations/prisma/prisma-database.module';

// OBS: O JwtModule TEM que ser Async, porque se não for NÃO carrega as Variáveis de Ambiente !!!

@Module({
    imports: [
        // MongooseDatabaseModule,
        PrismaDatabaseModule,
        JwtModule.registerAsync({
            useFactory: async () => ({
                secret: process.env.JWT_SECRET,
                signOptions: { expiresIn: process.env.JWT_EXPIRATION },
            }),
        }),
    ],
    controllers: [CreateUserController, LoginUserController],
    providers: [CreateUserService, LoginUserService],
})
export class UserModule {}
