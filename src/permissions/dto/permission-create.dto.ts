import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class PermissionCreateDto
{
    @ApiProperty({ example: 'Task Update' })
    @IsNotEmpty()
    @IsString()
    name: string;

    @ApiProperty({ example: 'TASK_UPDATE' })
    @IsNotEmpty()
    @IsString()
    codeName: string;
}
