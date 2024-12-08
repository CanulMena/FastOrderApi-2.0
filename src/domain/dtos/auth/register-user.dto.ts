import { regularExps } from "../../../configuration";

export class RegisterUserDto {

  constructor(
    public readonly name: string,
    public readonly email: string,
    public readonly password: string,
    public readonly rol: 'ADMIN' | 'OPERATOR' | 'DELIVERY' | 'SUPER_ADMIN',
    public readonly kitchenId: number
  ){}

  static create( props: {[key: string]: any} ): [ string?, RegisterUserDto? ] {
    const { name, email, password, rol, kitchenId } = props;

    if ( !name ) return ['Missing Name'];
    if ( !email ) return ['Missing Email']; //this is like ['Missing name', undefined]
    if ( !regularExps.email.test(email) ) return ['Invalid Email'];
    if ( !password ) return ['Missing Password'];
    if ( password.length < 6 ) return ['Password must be at least 6 characters long'];
    if ( rol !== 'ADMIN' && rol !== 'OPERATOR' && rol !== 'DELIVERY' && rol !== 'SUPER_ADMIN' ) return ['Invalid Rol'];
    // if ( !kitchenId ) return ['Missing Kitchen Id'];

    return [undefined, new RegisterUserDto( name, email, password, rol, kitchenId )];
  }

}