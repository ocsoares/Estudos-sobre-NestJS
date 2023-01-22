import { Module } from '@nestjs/common';
import { CreateUserController } from './create-user/create-user.controller';
import { CreateUserService } from './create-user/create-user.service';
import { FindUserController } from './find-user/find-user.controller';
import { FindUserService } from './find-user/find-user.service';

@Module({
    controllers: [CreateUserController, FindUserController],
    providers: [CreateUserService, FindUserService],
})
export class UserModule {}
