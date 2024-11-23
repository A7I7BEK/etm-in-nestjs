import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';
import { Order } from '../pagination/order.enum';

// BINGO
export abstract class BaseQueryDto<T>
{
    // BINGO
    @IsOptional()
    @Min(0) // temporary for this project, must be 1
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
        if (this.page > 0 && this.perPage > 0)
        {
            /**
             * temporary for this project, must be
             * return (this.page - 1) * this.perPage;
             */
            return this.page * this.perPage;
        }

        return 0;
    }
}