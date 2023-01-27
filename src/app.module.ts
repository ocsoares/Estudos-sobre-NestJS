import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './modules/user/user.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            // Hablita para usar Variáveis de Ambiente (.env)
            isGlobal: true, // Para TODO o Aplicativo (todos Controllers, Services, etc...)
            envFilePath: '.env', // Nome do Arquivo .env
        }),
        MongooseModule.forRoot(process.env.ATLAS_URL_CONNECTION),
        UserModule,
    ],
    controllers: [],
    providers: [],
})
export class AppModule {}
