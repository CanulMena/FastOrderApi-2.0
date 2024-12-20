
export class UpdateSideDto {
    constructor(
        public readonly id: number,
        public readonly name: string,
        public readonly imageUrl: string,
        public readonly description: string,
        // public readonly kitchenId?: number,
    ) {}

    static create( props: {[key: string]: any}) : [ string?, UpdateSideDto? ] {
        const { name, description, imageUrl, id, kitchenId } = props;

        if ( !id || isNaN(Number(id)) ) return ['ID argument must be a valid number', undefined]; 
        if (kitchenId) return ['Kitchen ID cannot be modified 👌', undefined];

        return [undefined, new UpdateSideDto(
            id, 
            name, 
            imageUrl, 
            description,
            // kitchenId, 
        )];
    }
}