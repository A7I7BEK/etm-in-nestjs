import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class ResourceFileDto
{
    @ApiProperty({ example: 123 })
    @IsNumber()
    id: number;
}
