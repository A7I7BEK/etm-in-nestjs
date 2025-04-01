import { IsDateString, IsInt, IsNotEmpty, IsOptional, IsString, Min } from 'class-validator';

export class EmployeeCreateDto
{
    @IsNotEmpty()
    @IsString()
    firstName: string;

    @IsNotEmpty()
    @IsString()
    lastName: string;

    @IsOptional()
    @IsNotEmpty()
    @IsString()
    middleName?: string;

    @IsOptional()
    @IsDateString()
    birthDate?: Date;

    @Min(0)
    @IsInt()
    photoFileId: number;
}
