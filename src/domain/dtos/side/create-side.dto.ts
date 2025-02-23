
export class CreateSideDto {
    constructor(
        public name: string,
        public kitchenId: number,
        public description?: string,
        public imageUrl?: string
    ) {}

    static create( props: {[key: string]: any}) : [ string?, CreateSideDto? ] {
        let { name, kitchenId, description, imageUrl } = props;

        kitchenId = Number(kitchenId);

        if ( !name ) return ['Name is required', undefined];
        if ( !kitchenId ) return ['Kitchen ID is required', undefined];
        if ( typeof kitchenId !== 'number' || kitchenId <= 0 ) return ['Kitchen ID must be a positive number', undefined];
        if (imageUrl && typeof imageUrl !== 'string') return ['Image URL must be a string or null', undefined];

        return [undefined, new CreateSideDto(name, kitchenId, description, imageUrl)];
    }
}