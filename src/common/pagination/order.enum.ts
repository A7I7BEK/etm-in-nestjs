
/**
 * temporary for this project:
 * properties are not appropriate,
 * change them to the real ones
 */
export enum Order
{
    ASC = 'asc',
    DESC = 'desc',
}


// BINGO
export const OrderReal = {
    [ Order.ASC ]: 'ASC',
    [ Order.DESC ]: 'DESC',
} as const;
