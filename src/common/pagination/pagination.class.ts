import { PaginationMeta } from './pagination-meta.class';

export class Pagination<T>
{
    data: T[];

    meta: PaginationMeta;

    /**
     * temporary for this project, must not exist
     */
    totalCount: number;

    constructor (data: T[], meta: PaginationMeta)
    {
        this.data = data;
        this.meta = meta;

        this.totalCount = meta.totalItems; // temporary for this project, must not exist
    }
}