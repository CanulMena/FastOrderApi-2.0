
export class User {
  constructor(
    public userId: number, //Identificador unico del usuario
    public email: string, // Guardar el correo con el que se registrará el usuario
    public passwordHash: string, // Guardar el hash en vez de la contraseña
    public rol: 'ADMIN' | 'OPERATOR' | 'DELIVERY', //Roles que puede tener el usuario
    // public creationDate: Date, //Fecha de creación
    public kitchenId: number // Relación con la cocina a la que pertenece
  ) {}

  static fromJson(object: {[key: string] : any}): User {
    const { 
      userId, 
      email, 
      passwordHash, 
      rol, 
      kitchenId } = object;

      if(!userId) throw new Error('userId is required');
      if(!email) throw new Error('email is required');
      if(!passwordHash) throw new Error('passwordHash is required');
      if(!rol) throw new Error('rol is required');
      if(!kitchenId) throw new Error('kitchenId is required');

      if (rol) {
        if (rol !== 'ADMIN' && rol !== 'OPERATOR' && rol !== 'DELIVERY') { // Se espera que el rol sea uno de los tres valores  
          throw new Error('rol is not a valid value');
        }
      }

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

    // let newCreationDate;
    // if (creationDate) {
    //   newCreationDate = new Date(creationDate);
    //   if (isNaN(newCreationDate.getTime())) {
    //     throw ('creationDate is not a valid date');
    //   }
    // }