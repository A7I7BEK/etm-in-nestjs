import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, MinLength } from 'class-validator';

export class SignInDto
{
    @ApiProperty({ example: 'johnny' })
    @IsEmail()
    userName: string;

    @ApiProperty({ example: '123456789$a' })
    @MinLength(10)
    password: string;
}
