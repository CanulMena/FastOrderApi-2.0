import { bcryptAdapter } from "../../../configuration/plugins";
import { RegisterUserDto } from "../../dtos/auth/index";
import { User } from "../../entities";
import { UserRepository } from "../../repositories";

//Dentro de los casos de uso, se debe manejar la lógica de negocio de la aplicación

interface CreateUserUseCase {
  exucute(registerUserDto: RegisterUserDto): Promise<object>
}

export class CreateUser implements CreateUserUseCase {

  constructor(
    private readonly userRepository: UserRepository
  ) {}

  async exucute(registerUserDto: RegisterUserDto): Promise<object> {
    const hashedPassword = bcryptAdapter.hash(registerUserDto.password);
    const newRegisterUserDto = { ...registerUserDto, password: hashedPassword };
    const user = await this.userRepository.createUser(newRegisterUserDto);
    const { passwordHash, ...userEntity } = user;
    return {
      user: userEntity,
      token: 'token'
    }
  }
}
