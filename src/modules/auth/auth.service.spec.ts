import { Test, TestingModule } from '@nestjs/testing';
import { UserRepository } from '../../repositories/abstracts/UserRepository';
import { AuthService } from '../auth/auth.service';

// FAZER TESTES...
describe('AuthService', () => {
    let service: AuthService;
    let repository: UserRepository;

    type authUserData = { email: string; password: string };

    const userData: authUserData = {
        email: 'Teste',
        password: 'teste123',
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AuthService,
                {
                    provide: UserRepository,
                    useValue: {
                        findByEmail: jest.fn(),
                    },
                },
            ],
        }).compile();

        service = module.get<AuthService>(AuthService);
        repository = module.get<UserRepository>(UserRepository);

        jest.spyOn(service, 'validateUser');
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
        expect(repository).toBeDefined();
    });

    it('should NOT validate a user if email is invalid', async () => {
        (repository.findByEmail as jest.Mock).mockResolvedValue(false);

        await expect(
            service.validateUser(userData.email, userData.password),
        ).rejects.toThrow(new Error('Email ou senha incorreto(s) !'));

        expect(service.validateUser).toHaveBeenCalledTimes(1);
        expect(repository.findByEmail).toHaveBeenCalledWith(userData.email);
    });
});
