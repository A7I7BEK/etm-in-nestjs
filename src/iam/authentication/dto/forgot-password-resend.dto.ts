import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class ForgotPasswordResendDto
{
    @ApiProperty({ example: '1234-asdf-1234-asdf-1234' })
    @IsUUID()
    otpId: string;
}
