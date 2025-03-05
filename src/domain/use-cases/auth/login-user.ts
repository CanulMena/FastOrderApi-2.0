import { bcryptAdapter, envs, GenerateTokenConfig, jwtAdapter } from "../../../configuration/plugins";
import { LoginUserDto } from "../../dtos/auth";
import { User } from "../../entities";
import { CustomError } from "../../errors";
import { UserRepository, JwtRepository } from "../../repositories";

export interface LoginUserUseCase {
  execute(loginUserDto: LoginUserDto): Promise<{ user: object, acessToken: string, refreshToken: string }>;
}

export class LoginUser implements LoginUserUseCase {

  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtRepository: JwtRepository
  ) {}

  async execute(loginUserDto: LoginUserDto): Promise<{ user: object, acessToken: string, refreshToken: string }> {
    const userFound = await this.userRepository.getUserByEmail(loginUserDto.email);
    const isMatchingPassword = await bcryptAdapter.compare(loginUserDto.password, userFound.passwordHash);
    if (!isMatchingPassword) throw CustomError.badRequest('Invalid password');
    const userEntity = this.mapUserEntity(userFound);
    const accessToken = await this.generateToken({ 
      payload: { id: userEntity.userId }, 
      secret: envs.JWT_SEED,
    });
    const refreshToken = await this.generateToken({ 
      payload: { id: userEntity.userId }, 
      expiresIn: '7d',
      secret: envs.REFRESH_JWT_SEED,
    });
    // Guardamos el refresh token en la base de datos
    const expireIn = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    const jwtSaved = await this.jwtRepository.saveRefreshToken(userEntity.userId, refreshToken, expireIn);
    if( !jwtSaved ) throw CustomError.internalServer('Error saving refresh token');

    return {
      user: userEntity,
      acessToken: accessToken,
      refreshToken: refreshToken
    };
  }

  private async generateToken(config: GenerateTokenConfig): Promise<string> {
    const token = await jwtAdapter.generateToken(config);
    if(!token) throw CustomError.internalServer('Error generating token');
    return token;
  }

  private mapUserEntity(userFound: User): Omit<User, 'passwordHash'> {
    const { passwordHash, ...userEntity } = User.fromJson({
      "id": userFound.userId,
      "nombre": userFound.name,
      "email": userFound.email,
      "emailValid": userFound.emailVerified,
      "contrasena": userFound.passwordHash,
      "rol": userFound.rol,
      "cocinaId": userFound.kitchenId
    });
    return userEntity;
  }

}