import { IsNumberString, IsOptional } from 'class-validator';

export class MinDimensionDto
{
    @IsNumberString({ no_symbols: true })
    @IsOptional()
    minWidth: string;

    @IsNumberString({ no_symbols: true })
    @IsOptional()
    minHeight: string;
}
