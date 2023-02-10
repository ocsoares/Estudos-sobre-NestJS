/* eslint-disable @typescript-eslint/naming-convention */

import { Test, TestingModule } from '@nestjs/testing';
import { TransactionRepository } from '../../../../repositories/abstracts/TransactionRepository';
import { MakeTransferController } from './make-transfer.controller';
import { MakeTransferService } from './make-transfer.service';
import * as supertest from 'supertest';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtAuthGuard } from '../../../../modules/auth/guards/jwt-auth.guard';
import { JwtStrategy } from '../../../../modules/auth/strategies/jwt.strategy';
import { ConfigModule } from '@nestjs/config';
import { InMemoryDbModule } from '../../../../modules/in-memory-database/in-memory-database.module';
import { APP_GUARD } from '@nestjs/core';
import { MakeTransferDTO } from './dtos/MakeTransferDTO';

describe('MakeTransferController', () => {
    let app: INestApplication;
    let controller: MakeTransferController;
    const route = '/transaction';

    const userData: MakeTransferDTO = {
        transfer_amount: 1250.483742,
        description: 'Iphone X',
        payment_method: 'credit_card',
        card_number: '5286221899691501',
        card_holder: 'Lucas Batista',
        card_expiration_date: '08/25',
        cvv: '375',
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [
                ConfigModule.forRoot(),
                PassportModule.register({ defaultStrategy: 'jwt' }),
                InMemoryDbModule,
            ],
            controllers: [MakeTransferController],
            providers: [
                MakeTransferService,
                {
                    provide: TransactionRepository,
                    useValue: {},
                },
                JwtStrategy,
                {
                    // ATIVA o JwtAuthGuard para esse Teste !!
                    // OBS: Usando o JwtStrategy em providers !
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

        controller = module.get<MakeTransferController>(MakeTransferController);

        await app.init();
    });

    afterEach(async () => {
        await app.close();
        jest.clearAllMocks();
    });

    it('should be defined', () => {
        expect(app).toBeDefined();
        expect(controller).toBeDefined();
    });

    // Tentar MOCKAR o JWT para PASSAR no teste de Fazer uma Transf. !!

    it('should NOT make a transfer if the JWT is invalid', async () => {
        // DESATIVA a Validação do JWT do JwtAuthGuard !!!
        jest.spyOn(JwtAuthGuard.prototype, 'canActivate').mockResolvedValue(
            true,
        );

        // MOCKAR o user do Decorator CurrentUser !!!!!!! <<

        const response = await supertest(app.getHttpServer())
            .post(route)
            .send(userData);
        // .expect(201);

        console.log(response.body);
    });
});
