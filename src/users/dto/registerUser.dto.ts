import {
    IsNotEmpty,
    IsString,
    IsEmail,
    IsEnum,
    IsPhoneNumber,
} from 'class-validator';

export class RegisterUserDto {
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmpty()
    @IsString()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @IsString()
    @IsEnum(['client', 'admin', 'manager'])
    role: string;

    @IsString()
    @IsPhoneNumber()
    contactPhone: string;

    @IsString()
    @IsNotEmpty()
    password: string;

    passwordHash: string;
}
