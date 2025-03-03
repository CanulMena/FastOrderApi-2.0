
export abstract class JwtRepository {
  abstract saveRefreshToken(userId: number, refreshtoken: string, expiresIn: Date): Promise<void>;
}