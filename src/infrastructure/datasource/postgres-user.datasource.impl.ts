import { PrismaClient } from "@prisma/client";
import { UserDatasource } from "../../domain/datasource/index";
import { User } from "../../domain/entities/index";
import { CustomError } from "../../domain/errors";
import { RegisterUserDto } from "../../domain/dtos/auth/index";

export class PosgresUserDataSourceImpl implements UserDatasource {

  private readonly prisma = new PrismaClient().usuario;

  async createUser(registerUserDto: RegisterUserDto): Promise<User> {

    const existeEmail = await this.prisma.findUnique({
      where: {
        email: registerUserDto.email
      }
    })

    if (existeEmail) throw CustomError.badRequest('Email already exists');

    const userCreated = await this.prisma.create({ 
      data: {
        nombre: registerUserDto.name,
        email: registerUserDto.email,
        contrasena: registerUserDto.password,
        rol: registerUserDto.rol,
        cocinaId: registerUserDto.kitchenId || null,
      }
    });
    
    return User.fromJson(userCreated);
  }

  async getUserByEmail(email: string): Promise<User> {

    const userFound = await this.prisma.findUnique({
      where: {
        email: email
      }
    });

    if (!userFound) throw CustomError.notFound('User not found');

    return User.fromJson(userFound!);
  }

  async updateEmailValidation(email: string, isValidated: boolean): Promise<User> {

    await this.getUserByEmail(email)

    const user = await this.prisma.update({
      where: { email },
      data: { emailValid: isValidated },
    });

    return User.fromJson(user);
  }

  getUsers(): Promise<User[]> {
    throw new Error("Method not implemented.");
  }
  getUserById(user: number): Promise<User> {
    throw new Error("Method not implemented.");
  }
  deletUser(user: number): Promise<User> {
    throw new Error("Method not implemented.");
  }
  updateUser(updateUserDto: any): Promise<User> {
    throw new Error("Method not implemented.");
  }

}