import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreatePermissionDto
{
    @ApiProperty({ example: 'Task Update' })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({ example: 'TASK_UPDATE' })
    @IsString()
    @IsNotEmpty()
    codeName: string;
}
