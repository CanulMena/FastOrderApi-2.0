import { CustomError } from "../errors/index";

const validRoles = ['ADMIN', 'OPERATOR', 'DELIVERY', 'SUPER_ADMIN'] as const;

export type UserRole = typeof validRoles[number]; //*User role simpre será uno de los valores de validRoles

export class User {

  public static readonly validRoles = validRoles; // esta copiando el valor de validRoles a validRoles = ['ADMIN', 'OPERATOR', 'DELIVERY', 'SUPER_ADMIN']
  
  constructor(
    public userId: number, //Identificador unico del usuario
    public name: string, // Nombre del usuario
    public email: string, // Guardar el correo con el que se registrará el usuario
    public emailVerified: boolean, // Verificar si el correo del usuario ha sido verificado
    public passwordHash: string, // Guardar el hash en vez de la contraseña
    public rol: UserRole, //Roles que puede tener el usuario
    public kitchenId?: number // Relación con la cocina a la que pertenece
  ) {}

  public static isValidRole(role: any): role is UserRole {
    return User.validRoles.includes(role);
  }

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
      if(!rol) throw CustomError.badRequest('Missing rol');
      if(!User.isValidRole(rol)) throw CustomError.badRequest('Invalid role');

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
