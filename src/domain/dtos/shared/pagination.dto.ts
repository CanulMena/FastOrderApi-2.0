
export class PaginationDto {
    constructor(
      public page: number,
      public limit: number
    ){}

    public static create( page: number = 1, limit: number = 10 ): [string?, PaginationDto?] {

        if ( typeof page !== 'number' || page <= 0 ) return ['Page must be a number greater than 0', undefined];
        if ( typeof limit !== 'number' || limit <= 0 ) return ['Limit must be a number greater than 0', undefined];

        return [undefined, new PaginationDto(page, limit)];
    }
}