export class Kitchen {
    constructor(
        public kitchenId: number, //Identificador único de la cocina
        public name: string, //Nombre de la cocina
        public address: string, //Dirección para ubicar a la cocina
        public creationDate: Date, //Fecha de creación en la que se registro la cocina
        public phone: string, //Numero para contactar a la la cocina
    ) {}
    //TODO: Create from object to create a new instance of the class
}
