export class User {
  constructor(
    public userId: number, //Identificador unico del usuario
    public email: string, // Guardar el correo con el que se registrará el usuario
    public passwordHash: string, // Guardar el hash en vez de la contraseña
    public rol: 'ADMIN' | 'OPERATOR' | 'DELIVERY', //Roles que puede tener el usuario
    // public creationDate: Date, //Fecha de creación
    public kitchenId: number // Relación con la cocina a la que pertenece
  ) {}

  static fromJSON(object: {[key: string] : any}): User {
    const { 
      userId, 
      email, 
      passwordHash, 
      rol, 
      // creationDate, // Se espera que sea un string con formato de fecha
      kitchenId } = object;

    let newCreationDate;



    if (rol) {
      if (rol !== 'ADMIN' && rol !== 'OPERATOR' && rol !== 'DELIVERY') { // Se espera que el rol sea uno de los tres valores  
        throw ('rol is not a valid value');
      }
    }

    // if (creationDate) {
    //   newCreationDate = new Date(creationDate);
    //   if (isNaN(newCreationDate.getTime())) {
    //     throw ('creationDate is not a valid date');
    //   }
    // }

    return new User(
      userId,
      email,
      passwordHash,
      rol,
      // creationDate,
      kitchenId
    );
  }
}