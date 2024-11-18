import { Type } from 'class-transformer';
import { IsInt, IsOptional, Min } from 'class-validator';

export class MinDimensionDto
{
    @IsOptional()
    @Min(1)
    @IsInt()
    @Type(() => Number)
    minWidth?: number;

    @IsOptional()
    @Min(1)
    @IsInt()
    @Type(() => Number)
    minHeight?: number;
}
