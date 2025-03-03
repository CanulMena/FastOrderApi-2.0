
export abstract class JwtDataSource {
  abstract saveRefreshToken(userId: number, refreshtoken: string, expiresIn: Date): Promise<void>;
}