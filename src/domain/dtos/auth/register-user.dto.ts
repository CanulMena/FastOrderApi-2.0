import { regularExps } from "../../../configuration";
import { User, UserRole } from "../../entities";

export class RegisterUserDto {

  constructor(
    public readonly name: string,
    public readonly email: string,
    public readonly password: string,
    public readonly rol: UserRole,
    public readonly kitchenId: number | null,
  ){}

  //Valores falsy de js: undefined, null, 0, NaN, "", o false

  static create( props: {[key: string]: any} ): [ string?, RegisterUserDto? ] { //*uso de tuplas para retornar un error o un objeto
    const { name, email, password, rol, kitchenId } = props;
    if (!name) return ['Missing Name'];
    if (!email) return ['Missing Email'];
    if (!regularExps.email.test(email) ) return ['Invalid Email'];
    if (!password) return ['Missing Password'];
    if (password.length < 6) return ['Password must be at least 6 characters long'];
    if (!User.isValidRole(rol)) return ['Invalid Role'];
    if (rol === 'SUPER_ADMIN' && kitchenId) return ['SUPER_ADMIN cannot have a Kitchen ID'];
    if ((rol === 'ADMIN' || rol === 'OPERATOR' || rol === 'DELIVERY') && !kitchenId ) return ['Missing Kitchen ID'];
    if (kitchenId){//si kitchenId es distinto de null, undefined, 0, NaN, "", o false
      if (typeof kitchenId !== 'number') return ['Kitchen ID must be a number'];
    }
    return [undefined, new RegisterUserDto( name, email, password, rol, kitchenId )];
  }
}