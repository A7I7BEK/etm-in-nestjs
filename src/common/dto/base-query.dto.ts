import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';
import { Order } from '../pagination/order.enum';

// BINGO: base class for query DTOs
export abstract class BaseQueryDto<T>
{
    @IsOptional()
    @Min(1)
    @IsInt()
    @Type(() => Number)
    page?: number;

    @IsOptional()
    @Max(100)
    @Min(1)
    @IsInt()
    @Type(() => Number) // BINGO: transform to number
    pageSize?: number;

    abstract sortBy?: T; // BINGO: abstract property for later use

    @IsOptional()
    @IsEnum(Order)
    sortDirection?: Order = Order.ASC;

    @IsOptional()
    @IsString()
    allSearch?: string;


    get skip(): number // BINGO: calculate skip using getter
    {
        if (this.page > 0 && this.pageSize > 0)
        {
            return (this.page - 1) * this.pageSize;
        }

        return 0;
    }

    get order()
    {
        /**
         * temporary for this project
         */
        return this.sortDirection;
    }
}