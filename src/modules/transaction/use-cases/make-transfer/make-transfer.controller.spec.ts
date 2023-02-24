

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
import { JwtModule, JwtService } from '@nestjs/jwt';
import { IUserPayload } from 'src/modules/auth/models/IUserPayload';
import { IReturnTransfer } from './interfaces/IReturnTransfer';
import { UserRepository } from '../../../../repositories/abstracts/UserRepository';
import { IUser } from 'src/models/IUser';
import { GenerateCreditCardPayableService } from '../../../../modules/payables/use-cases/generate-credit-card-payable/generate-credit-card-payable.service';
import { GenerateDebitCardPayableService } from '../../../../modules/payables/use-cases/generate-debit-card-payable/generate-debit-card-payable.service';
import { PayablesModule } from '../../../../modules/payables/payables.module';
import { Types } from 'mongoose';
import { TransactionModule } from '../../transaction.module';

describe('MakeTransferController', () => {
    let app: INestApplication;
    let service: MakeTransferService;
    let generateCreditCardPayableService: GenerateCreditCardPayableService;
    let generateDebitCardPayableService: GenerateDebitCardPayableService;
    let transactionRepository: TransactionRepository;
    let userRepository: UserRepository;
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

    const fixTransferAmountTwoDecimalPlaces = Number(
        userData.transfer_amount.toFixed(2),
    );

    const lastForDigitsCard = userData.card_number.slice(12, 16);

    const transactionRepositoryCreateData = {
        ...userData,
        account_id: payload.sub, // Id do payload a cima, que vai ser o JWT !!
        transfer_amount: fixTransferAmountTwoDecimalPlaces,
        card_number: `...-${lastForDigitsCard}`,
    };

    // Por algum motivo, quando aplica o Controller nesse teste, NÃO funciona !!
    // OBS: A Configuração do Controller, do Banco de Dados e do Passport JWT é configurado importando
    // o TransactionModule, porque nele já está configurado tudo, e o AppModule disponibiliza o Passport
    // JWT para TODOS os Módulos (óbvio, NÃO precisa importar ele aqui) !!!
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
                // OBS: Nesse teste, tive que adicionar os Services e Repositorys JÁ IMPORTADOS de PayablesModules para o
                // TransactionModule (está comentado lá explicando) para que os Métodos parassem de NÃO serem Chamados !!!
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

        app.useGlobalPipes(
            new ValidationPipe({
                whitelist: true,
                forbidNonWhitelisted: true,
            }),
        );

        service = module.get<MakeTransferService>(MakeTransferService);
        generateCreditCardPayableService =
            module.get<GenerateCreditCardPayableService>(
                GenerateCreditCardPayableService,
            );
        generateDebitCardPayableService =
            module.get<GenerateDebitCardPayableService>(
                GenerateDebitCardPayableService,
            );
        transactionRepository = module.get<TransactionRepository>(
            TransactionRepository,
        );
        userRepository = module.get<UserRepository>(UserRepository);
        jwtService = module.get<JwtService>(JwtService);

        jest.spyOn(jwtService, 'sign');
        jest.spyOn(transactionRepository, 'create');
        jest.spyOn(transactionRepository, 'findOneById');
        jest.spyOn(service, 'execute');
        jest.spyOn(generateCreditCardPayableService, 'execute');
        jest.spyOn(generateDebitCardPayableService, 'execute');

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
        expect(generateCreditCardPayableService).toBeDefined();
        expect(generateDebitCardPayableService).toBeDefined();
        expect(transactionRepository).toBeDefined();
        expect(userRepository).toBeDefined();
        expect(jwtService).toBeDefined();
    });

    it('should generate a valid JWT for tests', () => {
        expect(JWT).toEqual(expect.any(String));
        expect(jwtService.sign).toHaveBeenCalledWith(payload);
    });

    it('should NOT make a transfer if the JWT is invalid', async () => {
        const response = await supertest(app.getHttpServer())
            .post(route)
            .set('Authorization', `Bearer invalid_jwt`)
            .send(userData)
            .expect(401);

        const expectedMessage = 'Invalid or expired token !';

        expect(response.body.message).toEqual(expectedMessage);
        expect(transactionRepository.create).toHaveBeenCalledTimes(0);
        expect(transactionRepository.findOneById).toHaveBeenCalledTimes(0);
        expect(service.execute).toHaveBeenCalledTimes(0);
        expect(generateCreditCardPayableService.execute).toHaveBeenCalledTimes(
            0,
        );
        expect(generateDebitCardPayableService.execute).toHaveBeenCalledTimes(
            0,
        );
    });

    it('should NOT make a transfer if the request body data is invalid', async () => {
        const invalidBodyData = {
            money: 1250.483742,
            description: '',
            payment_method: 'none',
            card_number: '123456',
            card_holder: 'Lucas Batista',
            card_expiration_date: '21/07/2024',
            cvv: 375,
        };

        const expectedMessage = [
            'property money should not exist',
            'transfer_amount must be a number conforming to the specified constraints',
            'transfer_amount should not be empty',
            'description should not be empty',
            'payment_method must be debit_card or credit_card',
            'card_number must be a credit card',
            'card_expiration_date must be shorter than or equal to 5 characters',
            'cvv must be shorter than or equal to 3 characters',
            'cvv must be longer than or equal to 3 characters',
            'cvv must be a string',
        ];

        const response = await supertest(app.getHttpServer())
            .post(route)
            .set('Authorization', `Bearer ${JWT}`)
            .send(invalidBodyData)
            .expect(400);

        expect(response.body.message).toEqual(expectedMessage);
        expect(transactionRepository.create).toHaveBeenCalledTimes(0);
        expect(transactionRepository.findOneById).toHaveBeenCalledTimes(0);
        expect(service.execute).toHaveBeenCalledTimes(0);
        expect(generateCreditCardPayableService.execute).toHaveBeenCalledTimes(
            0,
        );
        expect(generateDebitCardPayableService.execute).toHaveBeenCalledTimes(
            0,
        );
    });

    it('should NOT make a transfer if the user by ID is invalid', async () => {
        jest.spyOn(userRepository, 'findById').mockResolvedValue(undefined);

        const response = await supertest(app.getHttpServer())
            .post(route)
            .set('Authorization', `Bearer ${JWT}`)
            .send(userData)
            .expect(400);

        const expectedMessage =
            'Não foi possível encontrar o usuário pelo id fornecido !';

        expect(response.body.message).toEqual(expectedMessage);
        expect(service.execute).toHaveBeenCalledTimes(1);
        expect(transactionRepository.create).toHaveBeenCalledTimes(0);
        expect(transactionRepository.findOneById).toHaveBeenCalledTimes(0);
        expect(generateCreditCardPayableService.execute).toHaveBeenCalledTimes(
            0,
        );
        expect(generateDebitCardPayableService.execute).toHaveBeenCalledTimes(
            0,
        );
    });

    it(`should NOT make a transfer if the CREDIT card transfer by id doesn't exists`, async () => {
        // Como não quero criar um Usuário para ter um ID válido no Banco de Dados
        // nesse teste, então apenas Mockei para o Usuário EXISTIR !!!
        jest.spyOn(userRepository, 'findById').mockResolvedValue({} as IUser);

        jest.spyOn(transactionRepository, 'findOneById').mockResolvedValue(
            undefined,
        );

        const response = await supertest(app.getHttpServer())
            .post(route)
            .set('Authorization', `Bearer ${JWT}`)
            .send(userData)
            .expect(400);

        const expectedMessage = 'Id de transferência inválido !';

        expect(response.body.message).toEqual(expectedMessage);
        expect(service.execute).toHaveBeenCalledTimes(1);
        expect(transactionRepository.create).toHaveBeenCalledTimes(1);
        expect(transactionRepository.findOneById).toHaveBeenCalledTimes(1);
        expect(generateCreditCardPayableService.execute).toHaveBeenCalledTimes(
            1,
        );
        expect(generateDebitCardPayableService.execute).toHaveBeenCalledTimes(
            0,
        );
    });

    it(`should NOT make a transfer if the DEBIT card transfer by id doesn't exists`, async () => {
        jest.spyOn(userRepository, 'findById').mockResolvedValue({} as IUser);
        jest.spyOn(transactionRepository, 'findOneById').mockResolvedValue(
            undefined,
        );

        const response = await supertest(app.getHttpServer())
            .post(route)
            .set('Authorization', `Bearer ${JWT}`)
            .send({
                ...userData,
                payment_method: 'debit_card',
            })
            .expect(400);

        const expectedMessage = 'Id de transferência inválido !';

        expect(response.body.message).toEqual(expectedMessage);
        expect(service.execute).toHaveBeenCalledTimes(1);
        expect(transactionRepository.create).toHaveBeenCalledTimes(1);
        expect(transactionRepository.findOneById).toHaveBeenCalledTimes(1);
        expect(generateCreditCardPayableService.execute).toHaveBeenCalledTimes(
            0,
        );
        expect(generateDebitCardPayableService.execute).toHaveBeenCalledTimes(
            1,
        );
    });

    it('should make a transfer', async () => {
        jest.spyOn(userRepository, 'findById').mockResolvedValue({} as IUser);

        const expectedData: IReturnTransfer = {
            date: expect.any(String),
            transfer_amount: transactionRepositoryCreateData.transfer_amount,
            description: transactionRepositoryCreateData.description,
            payment_method: transactionRepositoryCreateData.payment_method,
            card_number: transactionRepositoryCreateData.card_number,
            card_holder: transactionRepositoryCreateData.card_holder,
        };

        const expectedMessage = 'Transferência realizada com sucesso !';

        const response = await supertest(app.getHttpServer())
            .post(route)
            .set('Authorization', `Bearer ${JWT}`)
            .send(userData)
            .expect(201);

        expect(response.body.message).toEqual(expectedMessage);
        expect(response.body.data).toEqual(expectedData);
        // Testa os Dados que foram usados para CHAMAR o Método, e NÃO
        // o Retorno !!!
        expect(transactionRepository.create).toHaveBeenCalledWith(
            transactionRepositoryCreateData,
        );
        expect(service.execute).toHaveBeenCalledWith({
            // É chamado assim no Controller !!!
            account_id: payload.sub,
            ...userData,
        });
        expect(transactionRepository.findOneById).toHaveBeenCalledWith(
            expect.any(Types.ObjectId),
        );
        expect(generateCreditCardPayableService.execute).toHaveBeenCalledWith(
            expect.any(Types.ObjectId),
        );
        expect(generateDebitCardPayableService.execute).toHaveBeenCalledTimes(
            0,
        );
    });
});
