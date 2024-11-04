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
    page?: number; // default for project: 0

    @IsOptional()
    @Max(100)
    @Min(1)
    @IsInt()
    @Type(() => Number) // BINGO
    perPage?: number;

    abstract sortBy?: T; // BINGO

    @IsOptional()
    @IsEnum(Order)
    sortDirection?: Order = Order.ASC;

    @IsOptional()
    @IsString()
    allSearch?: string;


    get skip(): number // BINGO
    {
        if (typeof this.page === 'number' && typeof this.perPage === 'number')
        {
            return this.page * this.perPage;
        }

        return 0;
    }
}