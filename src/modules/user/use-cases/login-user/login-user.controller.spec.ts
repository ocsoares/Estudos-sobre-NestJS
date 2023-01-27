import { Test, TestingModule } from '@nestjs/testing';
import { LoginUserController } from './login-user.controller';

describe('LoginUserController', () => {
    let controller: LoginUserController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [LoginUserController],
        }).compile();

        controller = module.get<LoginUserController>(LoginUserController);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});
