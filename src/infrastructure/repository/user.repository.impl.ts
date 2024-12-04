import { UserDatasource } from "../../domain/datasource";
import { User } from "../../domain/entities";
import { UserRepository } from "../../domain/repositories";

export class UserRepositoryImpl implements UserRepository {

  constructor(
    private readonly userDatasource: UserDatasource
  ) {}

  createUser(user: any): Promise<User> {
    return this.userDatasource.createUser(user);
  }
  getUsers(): Promise<User[]> {
    return this.getUsers();
  }
  getUserById(userId: number): Promise<User> {
    return this.getUserById(userId);
  }
  deleteUser(userId: number): Promise<User> {
    return this.deleteUser(userId);
  }
  updateUser(user: any): Promise<User> {
    return this.updateUser(user);
  }
  
}