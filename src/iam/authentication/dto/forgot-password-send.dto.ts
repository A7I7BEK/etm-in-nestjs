import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsMobilePhone, IsPhoneNumber } from 'class-validator';

export class ForgotPasswordSendDto
{
    @ApiProperty({ example: 'aaa@aaa.aaa' })
    @IsEmail()
    // @IsMobilePhone('uz-UZ')
    @IsPhoneNumber('UZ')
    paramForSendingOtp: string;
}
