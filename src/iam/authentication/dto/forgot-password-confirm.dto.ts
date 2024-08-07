import { ApiProperty } from '@nestjs/swagger';
import { IsNumberString, IsUUID, MinLength } from 'class-validator';

export class ForgotPasswordConfirmDto
{
    @ApiProperty({ example: '1234-asdf-1234-asdf-1234' })
    @IsUUID()
    otpId: string;

    @ApiProperty({ example: '123456' })
    @MinLength(6)
    @IsNumberString()
    otpCode: string;
}