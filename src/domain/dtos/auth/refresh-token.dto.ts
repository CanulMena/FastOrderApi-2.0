
export class RefreshTokenDto {
  private constructor(
    public refreshToken: string
  ){}

  static create( props: {[key: string]: any} ): [string?, RefreshTokenDto?] {
    const { refreshToken } = props;
    if( !refreshToken ) return ['Missing refreshToken'];
    return [ undefined, new RefreshTokenDto(refreshToken) ];
  }
}