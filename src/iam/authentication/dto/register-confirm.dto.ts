import { ApiProperty } from '@nestjs/swagger';
import { IsNumberString, IsUUID, MinLength } from 'class-validator';

export class RegisterConfirmDto
{
    @ApiProperty({ example: '1234-asdf-1234-asdf-1234' })
    @IsUUID()
    otpId: string;

    @ApiProperty({ example: '123456' })
    @MinLength(6)
    @IsNumberString({ no_symbols: true })
    otpCode: string;

    @ApiProperty({ example: 'pass:123456789' })
    @MinLength(10)
    password: string;
}
