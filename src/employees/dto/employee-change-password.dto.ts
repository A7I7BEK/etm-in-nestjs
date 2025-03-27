import { IsInt, Min, MinLength } from 'class-validator';

export class EmployeeChangePasswordDto
{
    @Min(1)
    @IsInt()
    employeeId: number;

    @MinLength(10)
    password: string;
}
