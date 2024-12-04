
export class User {
  constructor(
    public userId: number, //Identificador unico del usuario
    public email: string, // Guardar el correo con el que se registrará el usuario
    public passwordHash: string, // Guardar el hash en vez de la contraseña
    public rol: 'ADMIN' | 'OPERATOR' | 'DELIVERY' | 'SUPER_ADMIN', //Roles que puede tener el usuario
    // public creationDate: Date, //Fecha de creación
    public kitchenId?: number // Relación con la cocina a la que pertenece
  ) {}

  static fromJson(object: {[key: string] : any}): User { //*Factory method para crear un usuario - de la clase creacional
    const {  //encanpsulan la logica de validacion, ya que esta relacionado con las reglas de negocio de la cración del usuario
      id,
      email, 
      contrasena,
      rol,
      cocinaId } = object;

      if(!id) throw new Error('id is required');
      if(!email) throw new Error('email is required');
      if(!contrasena) throw new Error('passwordHash is required');
      if(!rol) throw new Error('rol is required');
      
      //quiero validar que si kitchen id existe sea un numero
      if(cocinaId && typeof cocinaId !== 'number') throw new Error('cocinaId is not a number');

      if (rol !== 'ADMIN' && rol !== 'OPERATOR' && rol !== 'DELIVERY' && rol !== 'SUPER_ADMIN') { // Se espera que el rol sea uno de los cuatro valores  
        throw new Error('rol is not a valid value');
      }

    return new User(
      id,
      email,
      contrasena,
      rol,
      // creationDate,
      cocinaId
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