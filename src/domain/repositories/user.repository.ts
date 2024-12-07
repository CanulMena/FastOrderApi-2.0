import { User } from '../entities/index';

export abstract class UserRepository {
  abstract createUser( user : any ) : Promise<User>;
  abstract getUsers() : Promise<User[]>;
  abstract getUserById( userId: number ) : Promise<User>;
  abstract deleteUser( userId: number ) : Promise<User>;
  abstract updateUser( user: any ) : Promise<User>;
}