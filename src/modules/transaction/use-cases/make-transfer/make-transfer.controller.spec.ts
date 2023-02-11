/* eslint-disable @typescript-eslint/naming-convention */

import { Test, TestingModule } from '@nestjs/testing';
import { TransactionRepository } from '../../../../repositories/abstracts/TransactionRepository';
import { MakeTransferService } from './make-transfer.service';
import * as supertest from 'supertest';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { JwtAuthGuard } from '../../../../modules/auth/guards/jwt-auth.guard';
import { JwtStrategy } from '../../../../modules/auth/strategies/jwt.strategy';
import { ConfigModule } from '@nestjs/config';
import { InMemoryDbModule } from '../../../../modules/in-memory-database/in-memory-database.module';
import { APP_GUARD } from '@nestjs/core';
import { MakeTransferDTO } from './dtos/MakeTransferDTO';
import { TransactionModule } from '../../transaction.module';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { IUserPayload } from 'src/modules/auth/models/IUserPayload';

describe('MakeTransferController', () => {
    let app: INestApplication;
    let service: MakeTransferService;
    let repository: TransactionRepository;
    let jwtService: JwtService;
    let JWT: string;
    const route = '/transaction';

    // DESATIVA a Validação do JWT do JwtAuthGuard !!!
    // jest.spyOn(JwtAuthGuard.prototype, 'canActivate').mockResolvedValue(
    //     true,
    // );

    const payload: IUserPayload = {
        sub: 'any_id',
        name: 'any_name',
        email: 'any_email',
    };

    const userData: MakeTransferDTO = {
        transfer_amount: 1250.483742,
        description: 'Iphone X',
        payment_method: 'credit_card',
        card_number: '5286221899691501',
        card_holder: 'Lucas Batista',
        card_expiration_date: '08/25',
        cvv: '375',
    };

    // Por algum motivo, quando aplica o Controller nesse teste, NÃO funciona !!
    // OBS: A Configuração do Controller, do Banco de Dados e do Passport JWT é configurado importando
    // o TransactionModule, porque nele já está configurado tudo, e o AppModule disponibiliza o Passport
    // JWT para TODOS os Módulos (óbvio, NÃO precisa importar ele) !!!
    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [
                ConfigModule.forRoot(),
                JwtModule.register({
                    secret: process.env.JWT_SECRET,
                    signOptions: { expiresIn: process.env.JWT_EXPIRATION_TEST },
                }),
                TransactionModule,
                InMemoryDbModule,
            ],
            providers: [
                JwtStrategy,
                JwtService,
                {
                    provide: APP_GUARD,
                    useClass: JwtAuthGuard,
                },
            ],
        }).compile();

        app = module.createNestApplication();

        app.useGlobalPipes(
            new ValidationPipe({
                whitelist: true,
                forbidNonWhitelisted: true,
            }),
        );

        service = module.get<MakeTransferService>(MakeTransferService);
        repository = module.get<TransactionRepository>(TransactionRepository);
        jwtService = module.get<JwtService>(JwtService);

        jest.spyOn(jwtService, 'sign');

        JWT = jwtService.sign(payload);

        await app.init();
    });

    afterEach(async () => {
        await app.close();
        jest.clearAllMocks();
    });

    it('should be defined', () => {
        expect(app).toBeDefined();
        expect(service).toBeDefined();
        expect(repository).toBeDefined();
        expect(jwtService).toBeDefined();
    });

    it('should be valid jwt', () => {
        expect(jwtService.sign).toHaveBeenCalledWith(payload);
    });

    // TERMINAR de fazer os Expect's, com o testando o service e etc...
    it('should NOT make a transfer if the JWT is invalid', async () => {
        const response = await supertest(app.getHttpServer())
            .post(route)
            .set('Authorization', `Bearer invalid_jwt`)
            .send(userData)
            .expect(401);

        const expectedMessage = 'Invalid or expired token !';

        expect(response.body.message).toEqual(expectedMessage);
    });
});
