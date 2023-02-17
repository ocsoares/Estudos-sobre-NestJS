/* eslint-disable @typescript-eslint/naming-convention */

import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { TransactionRepository } from '../../../../repositories/abstracts/TransactionRepository';
import { UserRepository } from '../../../../repositories/abstracts/UserRepository';
import { ShowAllAccountTransactionsService } from './show-all-account-transactions.service';
import { ConfigModule } from '@nestjs/config';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { TransactionModule } from '../../transaction.module';
import { InMemoryDbModule } from '../../../../modules/in-memory-database/in-memory-database.module';
import { JwtStrategy } from '../../../../modules/auth/strategies/jwt.strategy';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from '../../../../modules/auth/guards/jwt-auth.guard';
import { IUserPayload } from 'src/modules/auth/models/IUserPayload';
import * as supertest from 'supertest';
import { IUser } from 'src/models/IUser';
import { ITransaction } from 'src/models/ITransaction';
import { IReturnTransfer } from '../make-transfer/interfaces/IReturnTransfer';
import { PayablesModule } from '../../../../modules/payables/payables.module';

describe('ShowAllAccountTransactionsController', () => {
    let app: INestApplication;
    let showAllAccountTransactionsService: ShowAllAccountTransactionsService;
    let transactionRepository: TransactionRepository;
    let userRepository: UserRepository;
    let jwtService: JwtService;
    let JWT: string;
    const route = '/transaction';

    const payload: IUserPayload = {
        sub: 'any_id',
        name: 'any_name',
        email: 'any_email',
    };

    const transactionData = [
        {
            account_id: '63eac85066108b9ad4d2c762',
            transfer_amount: 1250.48,
            description: 'Iphone X',
            payment_method: 'credit_card',
            card_number: '...-1501',
            card_holder: 'Lucas Batista',
            date: new Date(),
            createdAt: new Date(),
            updatedAt: new Date(),
            __v: 0,
        },
    ];

    const expectedData: IReturnTransfer[] = [
        {
            // date como any porque a Interface dele é setado como Date, mas o retorno da API
            // converte o tipo Date AUTOMATICAMENTE para string !!!
            // OBS: Aqui estou Transformando a Data em String igual no Retorno da API (com
            // toISOString() !! <<
            date: new Date().toISOString() as any,
            transfer_amount: 1250.48,
            description: 'Iphone X',
            payment_method: 'credit_card',
            card_number: '...-1501',
            card_holder: 'Lucas Batista',
        },
    ];

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [
                ConfigModule.forRoot(),
                JwtModule.register({
                    secret: process.env.JWT_SECRET,
                    signOptions: { expiresIn: process.env.JWT_EXPIRATION_TEST },
                }),

                // Consegui arrumar o erro dos Métodos que NÃO estavam sendo Mockados, porque TransactionModule depende
                // no código do seu módulo de PayablesModule, e mesmo NÃO usando as suas funcionalidades, PRECISA IMPORTAR !!!
                // OBS: A ordem de Importação IMPORTA, o Módulo que o outro módulo depende PRECISA vir PRIMEIRO, nesse caso,
                // TransactionModule depende de PayablesModule, então PayablesModule VEM PRIMEIRO !!!
                PayablesModule,
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

        showAllAccountTransactionsService =
            module.get<ShowAllAccountTransactionsService>(
                ShowAllAccountTransactionsService,
            );
        transactionRepository = module.get<TransactionRepository>(
            TransactionRepository,
        );
        userRepository = module.get<UserRepository>(UserRepository);
        jwtService = module.get<JwtService>(JwtService);

        jest.spyOn(jwtService, 'sign');
        jest.spyOn(userRepository, 'findById');
        jest.spyOn(transactionRepository, 'findAllById');
        jest.spyOn(showAllAccountTransactionsService, 'execute');

        JWT = jwtService.sign(payload);

        await app.init();
    });

    afterEach(async () => {
        await app.close();
        jest.clearAllMocks();
    });

    it('should be defined', () => {
        expect(app).toBeDefined();
        expect(showAllAccountTransactionsService).toBeDefined();
        expect(transactionRepository).toBeDefined();
        expect(userRepository).toBeDefined();
        expect(jwtService).toBeDefined();
    });

    it('should generate a valid JWT for tests', () => {
        expect(JWT).toEqual(expect.any(String));
        expect(jwtService.sign).toHaveBeenCalledWith(payload);
    });

    it('should NOT find all account transactions if the JWT is invalid', async () => {
        const response = await supertest(app.getHttpServer())
            .get(route)
            .set('Authorization', 'Bearer invalid_jwt')
            .expect(401);

        const expectedMessage = 'Invalid or expired token !';

        expect(response.body.message).toEqual(expectedMessage);
        expect(userRepository.findById).toHaveBeenCalledTimes(0);
        expect(transactionRepository.findAllById).toHaveBeenCalledTimes(0);
        expect(showAllAccountTransactionsService.execute).toHaveBeenCalledTimes(
            0,
        );
    });

    it(`should return a message if the user doesn't have any transactions`, async () => {
        jest.spyOn(userRepository, 'findById').mockResolvedValue({} as IUser);

        const response = await supertest(app.getHttpServer())
            .get(route)
            .set('Authorization', `Bearer ${JWT}`)
            .expect(200);

        const expectedMessage = 'Você ainda não realizou nenhuma transação !';

        expect(response.body.message).toEqual(expectedMessage);
        expect(userRepository.findById).toHaveBeenCalledTimes(1);
        expect(transactionRepository.findAllById).toHaveBeenCalledTimes(1);
        expect(showAllAccountTransactionsService.execute).toHaveBeenCalledWith(
            payload.sub,
        );
    });

    it('should find all account transactions', async () => {
        jest.spyOn(userRepository, 'findById').mockResolvedValue({} as IUser);
        jest.spyOn(transactionRepository, 'findAllById').mockResolvedValue(
            transactionData as unknown as ITransaction[],
        );

        const response = await supertest(app.getHttpServer())
            .get(route)
            .set('Authorization', `Bearer ${JWT}`)
            .expect(200);

        expect(response.body.data).toEqual(expectedData);
        expect(userRepository.findById).toHaveBeenCalledTimes(1);
        expect(transactionRepository.findAllById).toHaveBeenCalledTimes(1);
        expect(showAllAccountTransactionsService.execute).toHaveBeenCalledWith(
            payload.sub,
        );
    });
});
