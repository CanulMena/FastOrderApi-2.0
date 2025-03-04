import { JwtRepository } from '../../domain/repositories/jwt.repository';
import { JwtDataSource } from '../../domain/datasource/jwt.datasource';
import { Jwt } from '../../domain/entities';

export class JwtRepositoryImpl implements JwtRepository {

  constructor(
    private readonly jwtDataSource: JwtDataSource
  ){}

  saveRefreshToken(userId: number, refreshtoken: string, expiresIn: Date): Promise<Jwt> {
    return this.jwtDataSource.saveRefreshToken(userId, refreshtoken, expiresIn);
  }
  
  findRefreshToken(token: string): Promise<Jwt> {
    return this.jwtDataSource.findRefreshToken(token);
  }

  deleteRefreshToken(token: string): Promise<void> {
    return this.jwtDataSource.deleteRefreshToken(token);
  }

  updateRefreshToken(oldToken: string, newToken: string, expiresIn: Date): Promise<Jwt> {
    return this.jwtDataSource.updateRefreshToken(oldToken, newToken, expiresIn);
  }
  
}