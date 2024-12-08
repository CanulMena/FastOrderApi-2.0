import { CustomError } from "../errors/index";

export class User {
  constructor(
    public userId: number, //Identificador unico del usuario
    public name: string, // Nombre del usuario
    public email: string, // Guardar el correo con el que se registrará el usuario
    public emailVerified: boolean, // Verificar si el correo del usuario ha sido verificado
    public passwordHash: string, // Guardar el hash en vez de la contraseña
    public rol: 'ADMIN' | 'OPERATOR' | 'DELIVERY' | 'SUPER_ADMIN', //Roles que puede tener el usuario
    public kitchenId?: number // Relación con la cocina a la que pertenece
  ) {}

  static fromJson(object: {[key: string] : any}): User {
    const {
      id,
      nombre,
      email,
      emailValid,
      contrasena,
      rol,
      cocinaId } = object;

      if(!id) throw CustomError.badRequest('Missing id');
      if(!nombre) throw CustomError.badRequest('Missing nombre');
      if(!email) throw CustomError.badRequest('Missing email');
      if(emailValid === undefined) throw CustomError.badRequest('Missing emailValid');
      if(!contrasena) throw CustomError.badRequest('Missing password');
      // if(!cocinaId) throw CustomError.badRequest('Missing kitchenId');
      if(!rol) throw CustomError.badRequest('Missing rol');
      if (rol !== 'ADMIN' && rol !== 'OPERATOR' && rol !== 'DELIVERY' && rol !== 'SUPER_ADMIN') {
        throw CustomError.badRequest('Invalid rol');
      }

    return new User(
      id,
      nombre,
      email,
      emailValid,
      contrasena,
      rol,
      cocinaId
    );
    
  }
}
