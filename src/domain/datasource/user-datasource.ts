//TODO: Implement CreateUserDto and UpdateUserDto
import { User } from '../entities/index';


export abstract class UserDatasource {
  abstract createUser( user : any ) : Promise<User>; //todo: Implement CreateUserDto
  abstract getUsers() : Promise<User[]>;
  abstract getUserById( user: number ) : Promise<User>;
  abstract deletUser( user: number ) : Promise<User>;
  abstract updateUser( user: any ) : Promise<User>; //todo: Implement UpdateUserDto
}