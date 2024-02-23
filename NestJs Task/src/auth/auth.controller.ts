/*
https://docs.nestjs.com/controllers#controllers
*/

import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { User } from './dto/auth.dto';
import { Tokens } from 'src/users/dto/editUser.dto';

@Controller("auth")
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post("signup")
    signup(@Body() dto: User) {
        console.log({ dto });
        return this.authService.signup(dto);
    }

    @HttpCode(HttpStatus.OK)
    @Post("signin")
    signin(@Body() dto: User) {
        return this.authService.login(dto);
    }

    @Post('refresh')
    refreshToken(@Body() tokens: Tokens) {
        return this.authService.verifyRefreshToken(tokens)
    }
}
