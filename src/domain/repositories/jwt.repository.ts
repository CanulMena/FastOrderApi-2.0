import { SaveRefreshTokenDto } from "../dtos";
import { Jwt } from "../entities";

export abstract class JwtRepository {
  abstract saveRefreshToken(data: SaveRefreshTokenDto): Promise<Jwt>;
  abstract findRefreshToken(token: string): Promise<Jwt>;
  abstract deleteRefreshToken(token: string): Promise<void>;
  abstract updateRefreshToken(oldToken: string, newToken: string, expiresIn: Date): Promise<Jwt>;
}