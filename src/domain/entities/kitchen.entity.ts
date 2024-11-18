
export class Kitchen {
    constructor(
        public kitchenId: number, //Identificador único de la cocina
        public name: string, //Nombre de la cocina
        public address: string, //Dirección para ubicar a la cocina
        public phone: string, //Numero para contactar a la la cocina
    ) {}
    
    static fromJson = ( object: {[key: string] : any} ) : Kitchen => {
        const { id, nombre, direccion, telefono } = object;

        if ( !id ) throw new Error('id is required');
        if ( !nombre ) throw new Error('nombre is required');
        if ( !direccion ) throw new Error('direccion is required');
        if ( !telefono ) throw new Error('telefono is required');

        return new Kitchen(id, nombre, direccion, telefono);
    }

}
