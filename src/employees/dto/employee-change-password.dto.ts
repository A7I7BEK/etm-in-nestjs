import { MinLength } from 'class-validator';

export class EmployeeChangePasswordDto
{
    @MinLength(10)
    newPassword: string;
}
