import { bcryptAdapter, jwtAdapter } from "../../../configuration/plugins";
import { RegisterUserDto } from "../../dtos/auth/index";
import { CustomError } from "../../errors";
import { UserRepository, KitchenRepository } from "../../repositories";
import { SendEmailValidationLink } from './index';

//Dentro de los casos de uso, se debe manejar la lógica de negocio de la aplicación

interface CreateUserUseCase {
  exucute(registerUserDto: RegisterUserDto): Promise<object>
}

export class CreateUser implements CreateUserUseCase {

  constructor(
    private readonly kitchenRepository: KitchenRepository,
    private readonly userRepository: UserRepository,
    private readonly sendEmailValidationLink: SendEmailValidationLink
  ) {}

  async exucute(registerUserDto: RegisterUserDto): Promise<object> {

    //TODO: Validar que solo un SuperAdmin pueda crear un SuperAdmin o Admin

    if(registerUserDto.kitchenId) await this.kitchenRepository.getKitchenById(registerUserDto.kitchenId);
    const hashedPassword = bcryptAdapter.hash(registerUserDto.password);
    const newRegisterUserDto = { ...registerUserDto, password: hashedPassword };
    const user = await this.userRepository.createUser(newRegisterUserDto);
    await this.sendEmailValidationLink.execute(user.email);
    const { passwordHash, ...userEntity } = user;
    const token = await jwtAdapter.generateToken({ id: userEntity.userId });
    if(!token) throw CustomError.internalServer('Error generating token');
    return {
      user: userEntity,
      token: token
    }
  }

}
