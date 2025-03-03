import { JwtRepository } from '../../domain/repositories/jwt.repository';
import { JwtDataSource } from '../../domain/datasource/jwt.datasource';

export class JwtRepositoryImpl implements JwtRepository {

  constructor(
    private readonly jwtDataSource: JwtDataSource
  ){}

  saveRefreshToken(userId: number, refreshtoken: string, expiresIn: Date): Promise<void> {
    return this.jwtDataSource.saveRefreshToken(userId, refreshtoken, expiresIn);
  }

}