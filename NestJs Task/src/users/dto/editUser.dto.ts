import { IsEmail, IsNotEmpty, IsOptional, IsString } from "class-validator";
export class editUser {

    @IsEmail()
    @IsOptional()
    email: string

    @IsOptional()
    @IsString()
    firstName: string

    @IsOptional()
    @IsString()
    lastName: string
}

export class emailDto {

    @IsEmail()
    @IsNotEmpty()
    email: string
}

export class resetDto {

    @IsString()
    @IsNotEmpty()
    password: string


    @IsString()
    @IsNotEmpty()
    reset_tokken: string
}

export class Tokens {

    @IsString()
    @IsNotEmpty()
    token: string


    @IsString()
    @IsNotEmpty()
    refresh_token: string
}
