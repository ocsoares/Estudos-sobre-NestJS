import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';

// OBS: O ConfigModule aqui Habilita Globalmente as Variáveis de Ambiente para os ARQUIVOS de outros Módulos,
// (services, controllers, etc...) e NÃO para o arquivo do Módulo em si, nesse caso, tem que usar um Método
// async junto com useFactory async, exemplo: useFactory: async () => ({}) !!

@Module({
    imports: [
        ConfigModule.forRoot({
            // Hablita para usar Variáveis de Ambiente (.env)
            isGlobal: true, // Para TODO o Aplicativo (todos Controllers, Services, etc...)
            envFilePath: '.env', // Nome do Arquivo .env
        }),
        MongooseModule.forRoot(process.env.ATLAS_URL_CONNECTION),
        UserModule,
        AuthModule,
    ],
    controllers: [],
    providers: [],
})
export class AppModule {}
