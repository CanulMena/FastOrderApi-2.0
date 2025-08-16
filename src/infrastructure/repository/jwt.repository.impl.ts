import { JwtRepository } from '../../domain/repositories/jwt.repository';
import { JwtDataSource } from '../../domain/datasource/jwt.datasource';
import { Jwt } from '../../domain/entities';
import { SaveRefreshTokenDto } from '../../domain/dtos';

export class JwtRepositoryImpl implements JwtRepository {

  constructor(
    private readonly jwtDataSource: JwtDataSource
  ){}

  saveRefreshToken(data: SaveRefreshTokenDto): Promise<Jwt> {
    return this.jwtDataSource.saveRefreshToken(data);
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