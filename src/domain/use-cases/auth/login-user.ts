import { bcryptAdapter, jwtAdapter } from "../../../configuration/plugins";
import { LoginUserDto } from "../../dtos/auth";
import { User } from "../../entities";
import { CustomError } from "../../errors";
import { UserRepository, JwtRepository } from "../../repositories";

export interface LoginUserUseCase {
  execute(loginUserDto: LoginUserDto): Promise<object>
}

export class LoginUser implements LoginUserUseCase {

  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtRepository: JwtRepository
  ) {}

  async execute(loginUserDto: LoginUserDto): Promise<object> {
    const userFound = await this.userRepository.getUserByEmail(loginUserDto.email);
    const isMatchingPassword = await bcryptAdapter.compare(loginUserDto.password, userFound.passwordHash);
    if (!isMatchingPassword) throw CustomError.badRequest('Invalid password');
    const { passwordHash, ...userEntity } = User.fromJson({ // eliminamos el passwordHash del objeto userEntity
      "id": userFound.userId,
      "nombre": userFound.name,
      "email": userFound.email,
      "emailValid": userFound.emailVerified,
      "contrasena": userFound.passwordHash,
      "rol": userFound.rol,
      "cocinaId": userFound.kitchenId
    });
    const accessToken = await jwtAdapter.generateToken({ id: userEntity.userId });
    const refreshToken = await jwtAdapter.generateToken({ id: userEntity.userId }, '7d');
    if( !accessToken || !refreshToken ) throw CustomError.internalServer('Error generating token');

    try {
      // Guardamos el refresh token en la base de datos
      const expireIn = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
      await this.jwtRepository.saveRefreshToken(userEntity.userId, refreshToken, expireIn);

    } catch (error) {
      throw CustomError.internalServer('Error saving refresh token');
    }

    return {
      user: userEntity,
      acessToken: accessToken,
      refreshToken: refreshToken
    };
  }
}