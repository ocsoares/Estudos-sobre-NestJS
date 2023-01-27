import { BadRequestException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { IUser } from 'src/models/IUser';
import { UserRepository } from '../../repositories/abstracts/UserRepository';
import { CreateUserService } from './create-user.service';

// Esse tipo de Teste vai verificar a LÓGICA do Service, ou seja, os IFs, throws e o objetivo do Service,
// que é criar um Usuário com sucesso caso não exista um Usuário com o mesmo nome ou email !!!

describe('CreateUserService', () => {
    let createUserService: CreateUserService;
    let userRepository: UserRepository;

    // O provide recebe o que está no constructor do Service (providers, acima) ou seja, o UserRepository !!
    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [
                CreateUserService,
                {
                    provide: UserRepository,
                    useValue: {
                        findByName: jest.fn(), // jest.fn() = Mocka as funções !
                        findByEmail: jest.fn(),
                        create: jest.fn(),
                    },
                },
            ],
        }).compile();

        createUserService = module.get<CreateUserService>(CreateUserService);
        userRepository = module.get<UserRepository>(UserRepository);
    });

    it('should throw an error if the user already exists with findByName', async () => {
        // Passar como primeiro Parâmetro no jest.spyOn() o Repositório com os Métodos, e no segun-
        // -do o método a ser usado de acordo com o teste (spy), para rejeitar, aceitar, etc.. !!

        const expectBadRequestExceptionMessage =
            'Já existe um usuário cadastrado com esse nome !';

        jest.spyOn(userRepository, 'findByName').mockRejectedValue(
            new BadRequestException(expectBadRequestExceptionMessage),
        );

        expect(createUserService.execute({} as IUser)).rejects.toThrowError(
            new BadRequestException(expectBadRequestExceptionMessage),
        );
    });

    it('should throw an error if the user exists with findByEmail', async () => {
        const expectBadRequestExceptionMessage =
            'Já existe um usuário cadastrado com esse email !';

        jest.spyOn(userRepository, 'findByEmail').mockRejectedValue(
            new BadRequestException(expectBadRequestExceptionMessage),
        );

        expect(createUserService.execute({} as IUser)).rejects.toThrow(
            new BadRequestException(expectBadRequestExceptionMessage),
        );
    });
});

// APAGAR !!!!!!!!!!!!!!!!!!!!!!!!!!!!

// import { Test } from '@nestjs/testing';
// import { BadRequestException } from '@nestjs/common';
// import { CreateUserService } from './create-user.service';
// import { UserRepository } from '../../repositories/abstracts/UserRepository';
// import { IUser } from 'src/models/IUser';

// describe('CreateUserService', () => {
//     let createUserService: CreateUserService;
//     let userRepository: UserRepository;

//     const user: IUser = {
//         name: 'John Doe',
//         email: 'johndoe@example.com',
//         password: 'password',
//     };

//     beforeEach(async () => {
//         const module = await Test.createTestingModule({
//             providers: [
//                 CreateUserService,
//                 {
//                     provide: UserRepository,
//                     useValue: {
//                         findByName: jest.fn(),
//                         findByEmail: jest.fn(),
//                         create: jest.fn(),
//                     },
//                 },
//             ],
//         }).compile();

//         createUserService = module.get<CreateUserService>(CreateUserService);
//         userRepository = module.get<UserRepository>(UserRepository);
//     });

//     // describe('execute', () => {
//     //     let a: any;

//     //     it('should throw an error if the user already exists by name', async () => {
//     //         jest.spyOn(userRepository, 'findByName').mockResolvedValue(a);
//     //         await expect(createUserService.execute(user)).rejects.toThrow(
//     //             BadRequestException,
//     //         );
//     //     });

//     //     it('should throw an error if the user already exists by email', async () => {
//     //         jest.spyOn(userRepository, 'findByEmail').mockResolvedValue(a);
//     //         await expect(createUserService.execute(user)).rejects.toThrow(
//     //             BadRequestException,
//     //         );
//     //     });

//     //     it('should create a user if the user does not exist', async () => {
//     //         jest.spyOn(userRepository, 'findByName').mockResolvedValue(a);
//     //         jest.spyOn(userRepository, 'findByEmail').mockResolvedValue(a);
//     //         jest.spyOn(userRepository, 'create').mockResolvedValue(user);
//     //         const createdUser = await createUserService.execute(user);

//     //         expect(createdUser).toEqual(user);
//     //     });
//     // });
// });
