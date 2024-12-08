import { regularExps } from "../../../configuration";

export class LoginUserDto {
  private constructor(
    public email: string,
    public password: string
  ){}

  static create( props: {[key: string]: any} ): [string?, LoginUserDto?] {
    const { email, password } = props;
    if ( !email ) return ['Missing Email']; //this is like ['Missing name', undefined]
    if ( !regularExps.email.test(email) ) return ['Invalid Email'];
    if( !password ) return ['Password is required'];
    if( password.length < 6 ) return ['Password must be at least 6 characters long'];
    return [ undefined, new LoginUserDto(email, password) ];
  }
}