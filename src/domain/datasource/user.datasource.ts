import { PaginationDto } from '../dtos';
import {RegisterUserDto} from '../dtos/auth';
import { User } from '../entities/index';


export abstract class UserDatasource {
  abstract createUser(registerUserDto: RegisterUserDto): Promise<User>;
  abstract getUserByEmail(email: string): Promise<User>;
  abstract updateEmailValidation(email: string, isValidated: boolean): Promise<User>;
  abstract getUsers(): Promise<User[]>;
  abstract getUserById(user: number): Promise<User>;
  abstract deletUser(user: number): Promise<User>;
  abstract updateUser(updateUserDto: any): Promise<User>;
  abstract getUsersByKitchenIdCount(kitchenId: number): Promise<number>;
  abstract getUsersByKitchenId( kitchenId: number, pagination: PaginationDto): Promise<User[]>;
}