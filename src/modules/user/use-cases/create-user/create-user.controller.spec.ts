import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { UserRepository } from '../../../../repositories/abstracts/UserRepository';
import { UserModule } from '../../user.module';
import { InMemoryDbModule } from '../../../../modules/in-memory-database/in-memory-database.module';
import { CreateUserService } from './create-user.service';
import { CreateUserDTO } from './dtos/CreateUserDTO';

describe('UserController (e2e)', () => {
    let app: INestApplication;
    let userService: CreateUserService;

    beforeEach(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [UserModule, InMemoryDbModule],
            providers: [
                CreateUserService,
                {
                    provide: UserRepository,
                    useValue: {
                        findByName: jest.fn(),
                        findByEmail: jest.fn(),
                        create: jest.fn(),
                    },
                },
            ],
        }).compile();

        app = moduleFixture.createNestApplication();

        // PRECISA Habilitar Novamente as Verificações do Body da Aplicação, igual no main.ts !!!
        app.useGlobalPipes(
            new ValidationPipe({
                whitelist: true,
                forbidNonWhitelisted: true,
            }),
        );

        userService = moduleFixture.get<CreateUserService>(CreateUserService);

        // Para Mockar FUNÇÕES, é necessário usar jest.spyOn(), seguido da Variável que tem a/as Função(s) + Função
        // a ser Mockada !!
        // OBS: Para MÉTODOS, por exemplo os do UserRepository, usar o jest.fn() !!!
        // IMPORTANTE: Nesse caso, o userService.execute() é responsável por Fornecer os DADOS do Usuário Criado,
        // no objeto data !!!
        jest.spyOn(userService, 'execute');

        await app.init();
    });

    afterEach(async () => {
        await app.close();
        jest.clearAllMocks();
    });

    it('should create a new user', async () => {
        const userData: CreateUserDTO = {
            name: 'John Doe',
            email: 'johndoe@example.com',
            password: 'johndoe123',
        };

        const response = await request(app.getHttpServer())
            .post('/auth/register')
            .send(userData)
            .expect(201);

        expect(response.body.data).toEqual(userData);
        expect(userService.execute).toHaveBeenCalledWith(userData);
    });
});
