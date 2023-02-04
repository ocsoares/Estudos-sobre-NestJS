import { Test, TestingModule } from '@nestjs/testing';
import { LoginUserService } from './login-user.service';

describe('LoginUserService', () => {
    let service: LoginUserService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [LoginUserService],
        }).compile();

        service = module.get<LoginUserService>(LoginUserService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
