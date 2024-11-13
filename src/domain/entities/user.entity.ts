export class User {
  constructor(
    public userId: number, //Identificador unico del usuario
    public email: string, // Guardar el correo con el que se registrará el usuario
    public passwordHash: string, // Guardar el hash en vez de la contraseña
    public rol: 'ADMIN' | 'OPERATOR' | 'DELIVERY', //Roles que puede tener el usuario
    public creationDate: Date, //Fecha de creación
    public kitchenId: number // Relación con la cocina a la que pertenece
  ) {}
  //TODO: Create from object to create a new instance of the class
}