import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            // Hablita para usar Variáveis de Ambiente (.env)
            isGlobal: true, // Para TODO o Aplicativo (todos Controllers, Services, etc...)
            envFilePath: '.env', // Nome do Arquivo .env
        }),
        UserModule,
    ],
    controllers: [],
    providers: [],
})
export class AppModule {}
