export class PaginationMeta
{
    page: number;

    pageSize: number;

    totalItems: number;

    totalPages: number;

    hasPreviousPage: boolean;

    hasNextPage: boolean;

    constructor (page: number, pageSize: number, totalItems: number)
    {
        this.page = page;
        this.pageSize = pageSize;
        this.totalItems = totalItems;
        this.totalPages = Math.ceil(this.totalItems / this.pageSize);
        this.hasPreviousPage = this.page > 1;
        this.hasNextPage = this.page < this.totalPages;
    }
}