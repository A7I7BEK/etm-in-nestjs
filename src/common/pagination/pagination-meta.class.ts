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
        this.page = page || 0; // temporary for this project, must be: page || 1
        this.pageSize = pageSize || 0;
        this.totalItems = totalItems || 0;
        this.totalPages = 0;
        this.hasPreviousPage = false;
        this.hasNextPage = false;


        if (this.pageSize > 0)
        {
            this.totalPages = Math.ceil(this.totalItems / this.pageSize);
            this.hasPreviousPage = this.page > 0; // temporary for this project, must be: this.page > 1
            this.hasNextPage = this.page < this.totalPages;
        }
    }
}