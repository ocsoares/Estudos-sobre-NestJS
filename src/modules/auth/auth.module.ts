import { Module } from '@nestjs/common';
import { UserModule } from '../user/user.module';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { LocalStrategy } from './strategies/local.strategy';

@Module({
    imports: [UserModule],
    providers: [AuthService, LocalStrategy, JwtStrategy],
    controllers: [],
})
export class AuthModule {}
