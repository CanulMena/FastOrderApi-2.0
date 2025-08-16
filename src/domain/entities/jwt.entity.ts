import { CustomError } from "../errors";

export class Jwt {
  constructor(
    public readonly id: number,
    public readonly userId: number,
    public readonly token: string,
    public readonly createdAt: Date, 
    // public readonly expiresAt: Date,
  ){}

  static fromJson(object: {[key: string] : any}): Jwt {
    const { id, userId, token, createdAt, /* expiresAt */ } = object;

    if(!id) throw CustomError.badRequest('Missing id');

    // let newExpiresAt;
    // // if(!expiresAt) throw CustomError.badRequest('Missing expiresAt');
    // newExpiresAt = new Date(expiresAt);
    // if ( isNaN( newExpiresAt.getTime() ) ) throw CustomError.badRequest('expiresAt is not a valid date - format: yyyy-mm-dd hh:mm:ss');

    let newCreatedAt;
    if(!createdAt) throw CustomError.badRequest('Missing createdAt');
    newCreatedAt = new Date(createdAt);
    if ( isNaN( newCreatedAt.getTime() ) ) throw CustomError.badRequest('createdAt is not a valid date - format: yyyy-mm-dd hh:mm:ss');

    if(!userId) throw CustomError.badRequest('Missing userId');
    if(!token) throw CustomError.badRequest('Missing token');

    return new Jwt( id, userId, token, newCreatedAt, /* newExpiresAt  */);
  }

}