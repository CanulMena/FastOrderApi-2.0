import { CustomError } from "../errors";

export class Kitchen {
    constructor(
        public kitchenId: number, //Identificador único de la cocina
        public name: string, //Nombre de la cocina
        public address: string, //Dirección para ubicar a la cocina
        public phone: string, //Numero para contactar a la la cocina
        public dishCount?: number, 
        public sideCount?: number,
        public customerCount?: number, 
        public userCount?: number
    ) {}
    
    static fromJson = ( object: {[key: string] : any} ) : Kitchen => {
        const { id, nombre, direccion, telefono, _count } = object;

        if ( !id ) throw CustomError.badRequest('id is required');
        if ( !nombre ) throw CustomError.badRequest('nombre is required');
        if ( !direccion ) throw CustomError.badRequest('direccion is required');
        if ( !telefono ) throw CustomError.badRequest('telefono is required');


        return new Kitchen(
            id, 
            nombre, 
            direccion, 
            telefono,
            _count?.platillos ?? 0,
            _count?.complementos ?? 0, 
            _count?.clientes ?? 0, 
            _count?.usuarios ?? 0
        );
    }

}
