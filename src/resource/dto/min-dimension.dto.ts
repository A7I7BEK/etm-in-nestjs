import { IsOptional, IsPositive } from 'class-validator';

export class MinDimensionDto
{
    @IsPositive()
    @IsOptional()
    minWidth: number;

    @IsPositive()
    @IsOptional()
    minHeight: number;
}
