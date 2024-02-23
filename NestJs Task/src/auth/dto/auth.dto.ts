import { IsEmail, IsNotEmpty, IsString } from "class-validator";
export class User {

    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    password: string;
}
