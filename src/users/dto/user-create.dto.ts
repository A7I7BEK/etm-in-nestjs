import { IsEmail, IsInt, IsNotEmpty, IsNumberString, IsPhoneNumber, IsString, Min, MinLength } from 'class-validator';

export class UserCreateDto
{
    @Min(0)
    @IsInt()
    organizationId: number;

    @IsNotEmpty()
    @IsString()
    userName: string;

    @MinLength(10)
    password: string;

    @IsEmail()
    email: string;

    @IsPhoneNumber('UZ')
    @IsNumberString({ no_symbols: true })
    phoneNumber: string;
}
