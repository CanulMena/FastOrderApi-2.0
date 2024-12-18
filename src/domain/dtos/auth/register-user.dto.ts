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
    if (!name) return ['Missing Name'];
    if (!email) return ['Missing Email'];
    if (!regularExps.email.test(email) ) return ['Invalid Email'];
    if (!password) return ['Missing Password'];
    if (password.length < 6) return ['Password must be at least 6 characters long'];
    if (!User.isValidRole(rol)) return ['Invalid Role'];
    if (kitchenId !== null && (typeof kitchenId !== 'number' || kitchenId <= 0)) return ['Kitchen ID must be a positive number or null'];
    if (rol === 'SUPER_ADMIN' && kitchenId) return ['SUPER_ADMIN cannot have a Kitchen ID'];
    if ((rol === 'ADMIN' || rol === 'OPERATOR' || rol === 'DELIVERY') && !kitchenId ) return [`${rol} must have a Kitchen ID`];
    return [undefined, new RegisterUserDto( name, email, password, rol, kitchenId )];
  }
}