import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { TransactionModule } from './modules/transaction/transaction.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './modules/auth/guards/jwt-auth.guard';
import { LoginValidationBodyModule } from './modules/test/login-validation-body/login-validation-body.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: '.env',
        }),
        MongooseModule.forRoot(process.env.ATLAS_URL_CONNECTION),
        UserModule,
        AuthModule,
        TransactionModule,
        LoginValidationBodyModule,
    ],
    controllers: [],
    providers: [
        {
            // Ativa GLOBALMENTE o JwtAuthGuard para a Aplicação, e para DESATIVAR para uma Rota,
            // usar o Decorator Personalizado @IsPublic() no Controller !!!
            provide: APP_GUARD,
            useClass: JwtAuthGuard,
        },
    ],
})
export class AppModule {}
