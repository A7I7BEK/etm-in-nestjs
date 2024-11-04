export enum Order
{
    ASC = 'asc',
    DESC = 'desc',
}


/**
 * temporary for this project - BINGO
 */
export const OrderReverse = {
    [ Order.ASC ]: 'ASC',
    [ Order.DESC ]: 'DESC',
} as const;
