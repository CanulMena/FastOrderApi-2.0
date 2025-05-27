import { PaginationDto } from '../dtos';
import { RegisterUserDto } from '../dtos/auth';
import { User } from '../entities/index';

export abstract class UserRepository {
  abstract createUser(registerUserDto: RegisterUserDto): Promise<User>;
  abstract getUsers(): Promise<User[]>;
  abstract updateEmailValidation(email: string, isValidated: boolean): Promise<User>;
  abstract getUserByEmail(email: string): Promise<User>
  abstract getUserById(userId: number): Promise<User>;
  abstract deleteUser(userId: number): Promise<User>;
  abstract updateUser(updateUserDto: any): Promise<User>;
  abstract getUsersByKitchenIdCount(kitchenId: number): Promise<number>;
  abstract getUsersByKitchenId( kitchenId: number, pagination: PaginationDto): Promise<User[]>;
}