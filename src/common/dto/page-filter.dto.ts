import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';
import { Order } from '../pagination/order.enum';

// BINGO
export abstract class PageFilterDto<T>
{
    // BINGO
    @IsOptional()
    @Min(0)
    @IsInt()
    @Type(() => Number) // BINGO
    page?: number = 0;

    @IsOptional()
    @Max(100)
    @Min(1)
    @IsInt()
    @Type(() => Number) // BINGO
    perPage?: number = 10;

    abstract sortBy?: T; // BINGO

    @IsOptional()
    @IsEnum(Order)
    sortDirection?: Order = Order.DESC;

    @IsOptional()
    @IsString()
    allSearch?: string;


    get skip(): number // BINGO
    {
        return this.page * this.perPage;
    }
}