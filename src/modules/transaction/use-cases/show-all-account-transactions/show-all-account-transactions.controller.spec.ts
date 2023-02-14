import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { TransactionRepository } from '../../../../repositories/abstracts/TransactionRepository';
import { UserRepository } from '../../../../repositories/abstracts/UserRepository';
import { ShowAllAccountTransactionsController } from './show-all-account-transactions.controller';
import { ShowAllAccountTransactionsService } from './show-all-account-transactions.service';
import { ConfigModule } from '@nestjs/config';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { TransactionModule } from '../../transaction.module';
import { InMemoryDbModule } from '../../../../modules/in-memory-database/in-memory-database.module';
import { JwtStrategy } from '../../../../modules/auth/strategies/jwt.strategy';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from '../../../../modules/auth/guards/jwt-auth.guard';

describe('ShowAllAccountTransactionsController', () => {
    let app: INestApplication;
    let showAllAccountTransactionsService: ShowAllAccountTransactionsService;
    let transactionRepository: TransactionRepository;
    let userRepository: UserRepository;
    const route = '/transaction';

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

        showAllAccountTransactionsService =
            module.get<ShowAllAccountTransactionsService>(
                ShowAllAccountTransactionsController,
            );
        transactionRepository = module.get<TransactionRepository>(
            TransactionRepository,
        );
        userRepository = module.get<UserRepository>(UserRepository);
    });

    it('should be defined', () => {
        expect(app).toBeDefined();
        expect(showAllAccountTransactionsService).toBeDefined();
        expect(transactionRepository).toBeDefined();
        expect(userRepository).toBeDefined();
    });

    it('should find all account transactions', async () => {
        // const response = await supertest(app.getHttpServer())
        //     .
    });
});
