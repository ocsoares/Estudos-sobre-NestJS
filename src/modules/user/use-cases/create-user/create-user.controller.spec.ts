import { Test, TestingModule } from '@nestjs/testing';
import { UserRepository } from '../../../../repositories/abstracts/UserRepository';
import { CreateUserController } from './create-user.controller';
import { CreateUserService } from './create-user.service';
import { CreateUserDTO } from './dtos/CreateUserDTO';
import { returnHandle } from '../../../../interfaces/IController';

describe('CreateUserController', () => {
    let controller: CreateUserController;
    let service: CreateUserService;

    // Passar no controllers o Controller, em providers a DEPENDÊNCIA do Constructor desse Controller (que nesse
    // caso é o Service) e no provide passar a DEPENDÊNCIA do Constructor do Service (nesse caso) !!!
    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [CreateUserController],
            providers: [
                CreateUserService,
                {
                    provide: UserRepository,
                    useValue: {
                        create: jest.fn(),
                    },
                },
            ],
        }).compile();

        controller = module.get<CreateUserController>(CreateUserController);
        service = module.get<CreateUserService>(CreateUserService);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
        expect(service).toBeDefined();
    });

    it('should create a new user', async () => {
        const userData: CreateUserDTO = {
            name: 'Teste',
            email: 'teste@gmail.com',
            password: 'teste123',
        };

        // NÃO é possível Mockar desse jeito porque "as jest.Mock" só é possível utilizar com MÉTODOS de OBJETOS,
        // igual foi feito no teste do CreateUserService, em que foi Mockado os Métodos da Classe Abstrata
        // UserRepository !!!
        // (service.execute as jest.Mock).mockResolvedValue(userData);

        // Para Mockar FUNÇÕES, é necessário usar jest.spyOn(), seguido da Variável que tem a/as Função(s) + Função
        // a ser Mockada !!
        jest.spyOn(service, 'execute').mockResolvedValue(userData);

        // O handle pede como Parâmetro um Objeto do tipo CreateUserDTO e Retorna uma message e um data (esse
        // mesmo objeto do tipo CreateUserDTO no data) !!
        const result = await controller.handle(userData);

        expect(result).toEqual<returnHandle>({
            message: 'Usuário criado com sucesso !',
            data: userData,
        });

        expect(service.execute).toHaveBeenCalledWith(userData);
    });
});
