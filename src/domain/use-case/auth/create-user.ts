import { bcryptAdapter, jwtAdapter } from "../../../configuration/plugins";
import { RegisterUserDto } from "../../dtos/auth/index";
import { CustomError } from "../../errors";
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
    
    await this.sendEmailValidationLink(user.email);

    const { passwordHash, ...userEntity } = user;
    const token = await jwtAdapter.generateToken({ id: userEntity.userId });
    if(!token) throw CustomError.internalServer('Error generating token');
    return {
      user: userEntity,
      token: token
    }
  }

  async sendEmailValidationLink(email: string){
    const token = jwtAdapter.generateToken({ email });
    if(!token) throw CustomError.internalServer('Error generating token');
  }

}
