import { User } from "../../entities";
import { UserRepository } from "../../repositories";

interface CreateUserUseCase {
  exucute(data: any): Promise<User>
}

export class CreateUser implements CreateUserUseCase {

  constructor(
    private readonly userRepository: UserRepository
  ) {}

  exucute(data: any): Promise<User> {
    const { email, passwordHash, rol, kitchenId } = data;
    return this.userRepository.createUser({email, passwordHash, rol, kitchenId});
  }
}
