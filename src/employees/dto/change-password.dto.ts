import { MinLength } from 'class-validator';

export class ChangePasswordDto
{
    @MinLength(10)
    newPassword: string;
}
