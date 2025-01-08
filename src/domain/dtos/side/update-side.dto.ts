
export class UpdateSideDto {
    constructor(
        public readonly sideId: number,
        public readonly name?: string,
        public readonly imageUrl?: string,
        public readonly description?: string,
    ) {}

    static create( props: {[key: string]: any}) : [ string?, UpdateSideDto? ] {
        const { name, description, imageUrl, sideId } = props;

        if ( !sideId || isNaN(Number(sideId)) ) return ['ID argument must be a valid number', undefined]; 
        
        if (description !== undefined &&  typeof description !== 'string') return ['Description argument must be a string', undefined];
        
        if (imageUrl !== undefined && typeof imageUrl !== 'string') return ['ImageUrl argument must be a string', undefined];
        
        if (name !== undefined && typeof name !== 'string') return ['Name argument must be a string', undefined];

        return [undefined, new UpdateSideDto(
            sideId,
            name, 
            imageUrl, 
            description,
        )];
    }
}