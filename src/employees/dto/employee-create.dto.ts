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

    @IsOptional()
    @Min(1)
    @IsInt()
    photoFileId?: number;
}
