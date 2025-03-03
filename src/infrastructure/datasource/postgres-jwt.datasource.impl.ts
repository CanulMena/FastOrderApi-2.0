import { PrismaClient } from "@prisma/client";
import { JwtDataSource } from "../../domain/datasource";
import { CustomError } from "../../domain/errors";

export class PostgresJwtDatsourceImpl implements JwtDataSource {

  private readonly prisma = new PrismaClient().refreshToken;

  async saveRefreshToken(userId: number, refreshtoken: string, expiresIn: Date): Promise<void> {

    const tokenSaved = await this.prisma.create({
      data: {
        userId: userId,
        token: refreshtoken,
        expiresAt: expiresIn
      }
    })

    if (!tokenSaved) throw CustomError.internalServer('Error saving token in database');

  }

}