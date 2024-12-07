import { bcryptAdapter } from "../../../configuration/plugins";
import { RegisterUserDto } from "../../dtos/auth/index";
import { User } from "../../entities";
import { UserRepository } from "../../repositories";

//

interface CreateUserUseCase {
  exucute(registerUserDto: RegisterUserDto): Promise<User>
}

export class CreateUser implements CreateUserUseCase {

  constructor(
    private readonly userRepository: UserRepository
  ) {}

  exucute(registerUserDto: RegisterUserDto): Promise<User> {
    const hashedPassword = bcryptAdapter.hash(registerUserDto.password);
    const newUserDto = { ...registerUserDto, password: hashedPassword };
    console.log(newUserDto);
    return this.userRepository.createUser(newUserDto);
  }
}
