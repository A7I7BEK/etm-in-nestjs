import { PaginationMeta } from './pagination-meta.class';

export class Pagination<T>
{
    data: T[];

    meta: PaginationMeta;

    /**
     * temporary for this project
     */
    totalCount: number;

    constructor (data: T[], meta: PaginationMeta)
    {
        this.data = data;
        this.meta = meta;

        this.totalCount = meta.totalItems; // temporary for this project
    }
}