import { envs, GenerateTokenConfig, jwtAdapter } from "./../../../configuration";
import { CustomError } from "../../errors";
import { JwtRepository } from "../../../domain/repositories";


export interface RefreshTokenUseCase {
  execute(refreshToken: string): Promise<{ accessToken: string, refreshToken: string }>;
}

export class RefreshToken implements RefreshTokenUseCase {

  constructor(private readonly jwtRepository: JwtRepository) {}

  async execute(refreshToken: string): Promise<{ accessToken: string, refreshToken: string }> {
    try {
      // Buscar el refresh token en la base de datos
      const storedToken = await this.jwtRepository.findRefreshToken(refreshToken);
      if (!storedToken) throw CustomError.unAuthorized('Refresh token not found');

      // Validar el refresh token con la firma
      const decoded = await jwtAdapter.validateToken<{ id: number }>(refreshToken, envs.REFRESH_JWT_SEED);
      if (!decoded) { // si el token no es valido o ha expirado
        // const isExpired = new Date(storedToken.expiresAt) < new Date();// Verificar si el refresh token ha expirado
        // if (isExpired) {
        //   await this.jwtRepository.deleteRefreshToken(refreshToken); // Eliminar el token expirado
        //   throw CustomError.unAuthorized('Refresh token expired');
        // }
        throw CustomError.unAuthorized('Invalid refresh token');
      }

      // Generar nuevos tokens
      const newAccessToken = await this.generateToken({
        payload: { id: decoded.id },
        secret: envs.JWT_SEED,
      });

      const newRefreshToken = await this.generateToken({ 
        payload: { id: decoded.id }, 
        expiresIn: '7d',
        secret: envs.REFRESH_JWT_SEED,
      });

      const expireIn = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

      // Actualizar el refresh token en la base de datos
      const updatedToken = await this.jwtRepository.updateRefreshToken(refreshToken, newRefreshToken, expireIn);
      if (!updatedToken) throw CustomError.internalServer('Error updating refresh token');

      return { accessToken: newAccessToken, refreshToken: newRefreshToken };
    } catch (error: any) {
      throw CustomError.internalServer(error.message || 'Failed to refresh token');
    }
  }

  private async generateToken(config: GenerateTokenConfig): Promise<string> {
    const token = await jwtAdapter.generateToken(config);
    if(!token) throw CustomError.internalServer('Error generating token');
    return token;
  }

}
