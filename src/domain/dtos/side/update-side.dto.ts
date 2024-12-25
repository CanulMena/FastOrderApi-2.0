
export class UpdateSideDto {
    constructor(
        public readonly sideId: number,
        public readonly name: string,
        public readonly imageUrl: string,
        public readonly description: string,
    ) {}

    static create( props: {[key: string]: any}) : [ string?, UpdateSideDto? ] {
        const { name, description, imageUrl, sideId } = props;

        if ( !sideId || isNaN(Number(sideId)) ) return ['ID argument must be a valid number', undefined]; 
        //TODO: validar el imageUrl
        //TODO: validar el nombre
        //TODO: validar la descripción

        return [undefined, new UpdateSideDto(
            sideId,
            name, 
            imageUrl, 
            description,
        )];
    }
}