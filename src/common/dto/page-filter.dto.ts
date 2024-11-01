import { IsEnum, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';
import { Order } from '../pagination/order.enum';

export class PageFilterDto<T extends { id: number; }>
{
    @IsInt()
    @Min(0)
    @IsOptional()
    page?: number = 0;

    @IsInt()
    @Min(1)
    @Max(100)
    @IsOptional()
    perPage?: number = 10;

    @IsOptional()
    sortBy?: keyof T = 'id';

    @IsEnum(Order)
    @IsOptional()
    sortDirection?: Order = Order.DESC;

    @IsString()
    @IsOptional()
    allSearch?: string;
}