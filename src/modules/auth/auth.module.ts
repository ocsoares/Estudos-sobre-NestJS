import { Module } from '@nestjs/common';
import { UserModule } from '../user/user.module';
import { AuthService } from './auth.service';
import { LocalStrategy } from './strategies/local.strategy';

@Module({
    imports: [UserModule],
    providers: [AuthService, LocalStrategy],
    controllers: [],
})
export class AuthModule {}
