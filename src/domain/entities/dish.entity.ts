export class Dish {
  constructor(
    public dishId: number, //obligatorio
    public name: string, //obligatorio
    public pricePerServing: number, //obligatorio
    public pricePerHalfServing: number, //obligatorio
    public sideId: number, //obligatorio
    public kitchenId: number, //relacion a la cocina para identificar de donde es el plato
  ) {}
  //TODO: Create from object to create a new instance of the class
}