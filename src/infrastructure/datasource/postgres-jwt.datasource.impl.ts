import { PrismaClient } from "@prisma/client";
import { JwtDataSource } from "../../domain/datasource";
import { CustomError } from "../../domain/errors";
import { Jwt } from "../../domain/entities";
import jwt from 'jsonwebtoken';

export class PostgresJwtDatsourceImpl implements JwtDataSource {

  private readonly prisma = new PrismaClient().refreshToken;

  // Guardar un refresh token
  async saveRefreshToken(userId: number, refreshtoken: string, expiresIn: Date): Promise<Jwt> {
    const tokenSaved = await this.prisma.create({
      data: {
        userId: userId,
        token: refreshtoken,
        expiresAt: expiresIn
      }
    });

    return Jwt.fromJson(tokenSaved);
  }

  // Buscar un refresh token
  async findRefreshToken(token: string): Promise<Jwt> {
    const storedToken = await this.prisma.findUnique({
      where: { token }
    });

    if (!storedToken) throw CustomError.unAuthorized('Refresh token not found');

    return Jwt.fromJson(storedToken!);
  }

  // Eliminar un refresh token
  async deleteRefreshToken(token: string): Promise<void> {
    await this.prisma.delete({
      where: { token }
    }).catch(() => {
      throw CustomError.internalServer('Error deleting refresh token');
    });
  }

  // Actualizar un refresh token
  async updateRefreshToken(oldToken: string, newToken: string, expiresIn: Date): Promise<Jwt> {
    const updatedToken = await this.prisma.update({
      where: { token: oldToken },
      data: {
        token: newToken,
        expiresAt: expiresIn
      }
    });

    if (!updatedToken) throw CustomError.internalServer('Error updating refresh token');

    return Jwt.fromJson(updatedToken);
  }
}
