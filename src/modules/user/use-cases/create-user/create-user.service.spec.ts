import { BadRequestException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { Model } from 'mongoose';
import { IUser } from 'src/models/IUser';
import { UserRepository } from '../../../../repositories/abstracts/UserRepository';
import { MongooseUserRepository } from '../../../../repositories/implementations/mongoose/MongooseUserRepository';
import {
    User,
    UserDocument,
} from '../../../../repositories/implementations/mongoose/schemas/user.schema';
import { CreateUserService } from './create-user.service';

// Esse tipo de Teste vai verificar a LÓGICA do Service, ou seja, os IFs, throws e o objetivo do Service,
// que é criar um Usuário com sucesso caso não exista um Usuário com o mesmo nome ou email !!!

// ACHO que tá errado, porque aqui o Service não tem acesso ao Banco de Dados e não recebe Dados, ele só recebe o Repositório !!!!

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

    describe('execute', () => {
        it('should throw BadRequestException if user already exists by name', async () => {
            const userData: IUser = {
                name: 'John Doe',
                email: 'johndoe@example.com',
                password: '123',
            };

            // (repository.findByName as jest.Mock).mockResolvedValue(userData);

            console.log('FIDFIOS:', await service.execute(userData));

            expect(await service.execute(userData)).rejects.toThrowError(
                new BadRequestException(
                    'Já existe um usuário cadastrado com esse nomeDJSIFOS !',
                ),
            );

            // try {
            //     await service.execute(userData);
            //     fail();
            // } catch (error) {
            //     expect(error).toBeInstanceOf(BadRequestException);
            //     expect(error.message).toEqual(
            //         'Já existe um usuário cadastrado com esse nomeDJSIFOS !',
            //     );
            // }
        });

        it('should throw BadRequestException if user already exists by email', async () => {
            const userData: IUser = {
                name: 'John Doe',
                email: 'johndoe@example.com',
                password: '123',
            };

            (repository.findByEmail as jest.Mock).mockResolvedValue(userData);

            try {
                await service.execute(userData);
                fail();
            } catch (error) {
                expect(error).toBeInstanceOf(BadRequestException);
                expect(error.message).toEqual(
                    'Já existe um usuário cadastrado com esse email !',
                );
            }
        });

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
});
