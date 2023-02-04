import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { LoginUserController } from './login-user.controller';
import { LoginUserService } from './login-user.service';

describe('LoginUserController', () => {
    let controller: LoginUserController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [LoginUserController],
            providers: [
                LoginUserService,
                {
                    provide: JwtService,
                    useExisting: JwtService,
                    useValue: {
                        sign: jest.fn(),
                    },
                },
            ],
        }).compile();

        controller = module.get<LoginUserController>(LoginUserController);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});
