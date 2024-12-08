import { bcryptAdapter, jsonwebtokenAdapter } from "../../../configuration/plugins";
import { LoginUserDto, RegisterUserDto } from "../../dtos/auth";
import { User } from "../../entities";
import { CustomError } from "../../errors";
import { UserRepository } from "../../repositories";

export interface LoginUserUseCase {
  execute(loginUserDto: LoginUserDto): Promise<object>
}

export class LoginUser implements LoginUserUseCase {

  constructor(
    private readonly userRepository: UserRepository
  ) {}

  async execute(loginUserDto: LoginUserDto): Promise<object> {
    const userFound = await this.userRepository.getUserByEmail(loginUserDto.email);
    const isMatchingPassword = await bcryptAdapter.compare(loginUserDto.password, userFound.passwordHash);
    if (!isMatchingPassword) throw CustomError.badRequest('Invalid password');
    const { passwordHash, ...userEntity } = User.fromJson({
      "id": userFound.userId,
      "nombre": userFound.name,
      "email": userFound.email,
      "emailValid": userFound.emailVerified,
      "contrasena": userFound.passwordHash,
      "rol": userFound.rol,
      "cocinaId": userFound.kitchenId
    });
    const token = await jsonwebtokenAdapter.generateToken({ id: userEntity.userId }, 'secret');
    if( !token ) throw CustomError.internalServer('Error generating token');
    return {
      user: userEntity,
      token: token
    };
  }
}