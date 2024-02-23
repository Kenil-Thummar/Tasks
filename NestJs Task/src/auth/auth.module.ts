import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

import { Global, Module } from '@nestjs/common';
import { JwtStrategy } from './strategies/jwt.strategy';

@Global()
@Module({
    imports: [JwtModule],
    controllers: [
        AuthController,],
    providers: [
        AuthService, JwtStrategy],
    exports: [AuthService]
})
export class AuthModule { }
