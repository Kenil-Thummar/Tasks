/*
https://docs.nestjs.com/providers#services
*/

import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { User } from './dto/auth.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { Tokens } from 'src/users/dto/editUser.dto';


@Injectable()
export class AuthService {
    constructor(
        private readonly prismaService: PrismaService,
        private readonly jwtService: JwtService,
        private readonly config: ConfigService,
    ) { }
    async signup(dto: User) {
        try {
            // hashing the password
            const hash = bcrypt.hashSync(dto.password, 10);

            // storing in the database
            const user = await this.prismaService.users.create({
                data: {
                    email: dto.email,
                    hash,
                },
            });

            return "Registration has been done. Login using your credentials";
        } catch (error) {
            // Check if the error is related to duplicate email entry
            if (error.code === "P2002" && error.meta?.target?.includes("email")) {
                return "Email is already registered. Please use a different email address.";
            }

            // Handle other errors or rethrow the original error
            throw error;
        }
    }


    async login(dto: User) {
        let user = await this.prismaService.users.findUnique({
            where: {
                email: dto.email,
            },
        });

        if (!user) {
            throw new ForbiddenException('No user found for that email');
        }

        let compare = await bcrypt.compareSync(dto.password, user.hash);
        if (compare) {
            const token = this.Token(user.id, user.email)
            const refreshToken = this.refreshToken(user.id, user.email)
            return `TOKEN:-${(await token).access_token}\nREFRESHTOKEN:-${(await refreshToken).refresh_token}`;
        } else {
            throw new ForbiddenException('Incorrect password');
        }
    }

    async Token(
        userid: number,
        email: string,
    ): Promise<{ access_token: string }> {
        const payload = {
            sub: userid,
            email,
        };
        const token = await this.jwtService.signAsync(payload, {
            expiresIn: '15m',
            secret: `${this.config.get('SECRET')}`,
        });
        return {
            access_token: token
        };
    }

    async refreshToken(
        userid: number,
        email: string,
    ): Promise<{ refresh_token: string }> {
        const payload = {
            sub: userid,
            email,
        };
        const refresh_token = await this.jwtService.signAsync(payload, {
            expiresIn: '7d',
            secret: `${this.config.get('REFRESH_SECRET')}`,
        });
        return {
            refresh_token: refresh_token
        };
    }

    async resetToken(
        userid: number,
        email: string,
    ): Promise<{ reset_token: string }> {
        const payload = {
            sub: userid,
            email,
        };
        const token = await this.jwtService.signAsync(payload, {
            expiresIn: '5m',
            secret: `${this.config.get('RESET_SECRET')}`,
        });
        return {
            reset_token: token
        };
    }

    async verifyRefreshToken(tokens: Tokens) {
        try {
            const checkToken = jwt.verify(tokens.token, this.config.get("SECRET"));
            try {
                const checkRefreshToken = jwt.verify(tokens.refresh_token, this.config.get("REFRESH_SECRET"));
            } catch (refreshTokenError) {
                console.error('Refresh Token verification failed:', refreshTokenError.message);
                return "Both tokens are invalid";
            }
        } catch (tokenError) {
            if (tokenError.name === 'TokenExpiredError') {
                console.log('Access Token has expired.');
                try {
                    const userData = jwt.verify(tokens.refresh_token, this.config.get('REFRESH_SECRET'));
                    let userid = userData["sub"] as unknown as number;
                    let useremail = userData["email"];
                    const newToken = await this.Token(userid, useremail);
                    return `Your new access_token: ${newToken.access_token}`;
                } catch (refreshTokenError) {
                    console.error('Refresh Token verification failed:', refreshTokenError.message);
                    return "Refresh Token is also invalid";
                }
            } else {
                console.error('Access Token verification failed:', tokenError.message);
                return "Access Token is invalid";
            }
        }
    }
}
