import { PaginationMeta } from './pagination-meta.class';

export class Pagination<T>
{
    data: T[];

    meta: PaginationMeta;

    constructor (data: T[], meta: PaginationMeta)
    {
        this.data = data;
        this.meta = meta;
    }
}