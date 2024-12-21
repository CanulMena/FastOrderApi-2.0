
export class CreateSideDto {
    constructor(
        public readonly name: string,
        public readonly kitchenId: number,
        public readonly description?: string,
        public readonly imageUrl?: string
    ) {}

    static create( props: {[key: string]: any}) : [ string?, CreateSideDto? ] {
        const { name, kitchenId, description, imageUrl } = props;

        if ( !name ) return ['Name is required', undefined];
        if ( !kitchenId ) return ['Kitchen ID is required', undefined];
        if ( typeof kitchenId !== 'number' || kitchenId <= 0 ) return ['Kitchen ID must be a positive number', undefined];

        return [undefined, new CreateSideDto(name, kitchenId, description, imageUrl)];
    }
}