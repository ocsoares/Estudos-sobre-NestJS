import { BadRequestException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { IUser } from 'src/models/IUser';
import { UserRepository } from '../../../../repositories/abstracts/UserRepository';
import { CreateUserService } from './create-user.service';

// Esse tipo de Teste vai verificar a LÓGICA do Service, ou seja, os IFs, throws e o objetivo do Service,
// que é criar um Usuário com sucesso caso não exista um Usuário com o mesmo nome ou email !!!

describe('CreateUserService', () => {
    let service: CreateUserService;
    let repository: UserRepository;

    beforeEach(async () => {
        const module = await Test.createTestingModule({
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

        service = module.get<CreateUserService>(CreateUserService);
        repository = module.get(UserRepository);
    });

    // Nos testes de ERRO, como o Banco de Dados está MOCKADO, esses Testes irão apenas testar se os Métodos Mockados do
    // repository (UserRepository, nesse caso) retornam o erro esperado no Service quando ele é chamado !!
    // OBS: O service.execute() nesses casos de Erro é chamado para CHECAR as Condicionais de Erro DENTRO do Service, junto
    // com os Métodos Mockados !!

    it('should throw BadRequestException if users already exists with findByName method', async () => {
        const userData: IUser = {
            name: 'Teste',
            email: 'teste@gmail.com',
            password: 'teste123',
        };

        // Mockando o RETORNO do Dado que esse Método pede (uma Interface IUser) DENTRO desse Método, porque no Service se
        // existir esse Dado, TEM que retornar ERRO !!
        // OBS: Como esse Método foi Mockado, independente do Dado passado nele, IRÁ Retornar o Dado passado no
        // mockResolvedValue() !!
        // IMPORTANTE: Como esse método foi Mockado, SEMPRE existirá um Usuário, então o Service SEMPRE irá retornar
        // ERRO, NÃO importa o que for passado  !!
        (repository.findByName as jest.Mock).mockResolvedValue(userData);

        // Espera o ERRO especificado no Service !!
        // Passar userData dentro do service.execute() para passar pelo teste ...toHaveBeenCalledWith(userData.name); !!!
        // OBS: o await ANTES do expect já transforma o Método em assíncrono, então não precisa colocar o await antes
        // do Método !!
        // IMPORTANTE: O que está dentro de service.execute(...) NÃO necessariamente importa, porque ela é importante apenas
        // para EXECUTAR o Service que irá checar a condição do findByName (nesse caso), que JÁ ESTÁ MOCKADO !!!
        await expect(service.execute(userData)).rejects.toThrow(
            new BadRequestException(
                'Já existe um usuário cadastrado com esse nome !',
            ),
        );

        // ENTENDER porque NÃO pode passar userData pq dá ERRO !!!
        expect(repository.findByName).toHaveBeenCalledWith(userData.name);
    });

    it('should throw BadRequestException if user already exists with findByEmail method', async () => {
        const userData: IUser = {
            name: 'John Doe',
            email: 'johndoe@example.com',
            password: '123',
        };

        (repository.findByEmail as jest.Mock).mockResolvedValue(userData);

        await expect(service.execute(userData)).rejects.toThrow(
            new BadRequestException(
                'Já existe um usuário cadastrado com esse email !',
            ),
        );

        expect(repository.findByEmail).toHaveBeenCalledWith(userData.email);
    });

    // FAZER ESSE direito...
    it('should create a new user', async () => {
        const userData: IUser = {
            name: 'John Doe',
            email: 'johndoe@example.com',
            password: '123',
        };

        (repository.create as jest.Mock).mockResolvedValue(userData);

        const result = await service.execute(userData);

        expect(result).toEqual(userData);
        expect(repository.create).toHaveBeenCalledWith(userData);
    });
});
