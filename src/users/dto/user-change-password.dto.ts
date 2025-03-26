import { MinLength } from 'class-validator';

export class UserChangePasswordDto
{
    @MinLength(10)
    currentPassword: string;

    @MinLength(10)
    newPassword: string;
}
