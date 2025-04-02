import { regularExps } from "../../../configuration";
import { User, UserRole } from "../../entities";

export class RegisterUserDto {

  constructor(
    public readonly name: string,
    public readonly email: string,
    public readonly password: string,
    public readonly rol: UserRole,
    public readonly kitchenId?: number,
  ){}

  //Valores falsy de js: undefined, null, 0, NaN, "", o false

  static create( props: {[key: string]: any} ): [ string?, RegisterUserDto? ] { //uso de tuplas para retornar un error o un objeto
    const { name, email, password, rol, kitchenId } = props;
    if (!name) return ['Missing name'];
    if (!email) return ['Missing email'];
    if (!regularExps.email.test(email) ) return ['Invalid email format'];
    if (!password) return ['Missing password'];
    if (password.length < 6) return ['Password must be at least 6 characters long'];
    if (!regularExps.password.test(password)) return ['Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'];
    if (!User.isValidRole(rol)) return [`Invalid role. Valid roles: ${User.validRoles}`];
    if (kitchenId !== null && (typeof kitchenId !== 'number' || kitchenId <= 0)) return ['kitchenId must be a positive number or null'];
    if (rol === 'SUPER_ADMIN' && kitchenId) return ['SUPER_ADMIN cannot have a kitchenId'];
    if ((rol === 'ADMIN' || rol === 'OPERATOR' || rol === 'DELIVERY') && !kitchenId ) return [`${rol} must have a kitchenId`];
    return [undefined, new RegisterUserDto( name, email, password, rol, kitchenId )];
  }
}