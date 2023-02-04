import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { LoginUserService } from '../login-user/login-user.service';

describe('LoginUserService', () => {
    let service: LoginUserService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                LoginUserService,
                {
                    provide: JwtService,
                    useExisting: JwtService, // Usa uma Instância EXISTENTE de JwtService (OBRIGATÓRIO) !!!
                    useValue: {
                        sign: jest.fn(),
                    },
                },
            ],
        }).compile();

        service = module.get<LoginUserService>(LoginUserService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
