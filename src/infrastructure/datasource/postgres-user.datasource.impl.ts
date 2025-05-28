import { Prisma, PrismaClient } from "@prisma/client";
import { UserDatasource } from "../../domain/datasource/index";
import { User } from "../../domain/entities/index";
import { CustomError } from "../../domain/errors";
import { RegisterUserDto } from "../../domain/dtos/auth/index";
import { PaginationDto } from "../../domain/dtos";

export class PostgresUserDataSourceImpl implements UserDatasource {

  private readonly prisma = new PrismaClient().usuario;

  async createUser(registerUserDto: RegisterUserDto): Promise<User> {
    try {
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
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') { // Código de error para clave única violada
          // Manejo del error de clave única
          throw CustomError.badRequest(`The ${error.meta?.target} already exist`); 
        }
      }
      throw CustomError.internalServer('error not controlled'); // Relanza otros errores no controlados
    }
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
  async getUserById(user: number): Promise<User> {

    const userFound = await this.prisma.findUnique({
      where: {
        id: user
      }
    });

    if (!userFound) throw CustomError.notFound('User not found');

    return User.fromJson(userFound!);
  }
  
  deletUser(user: number): Promise<User> {
    throw new Error("Method not implemented.");
  }
  updateUser(updateUserDto: any): Promise<User> {
    throw new Error("Method not implemented.");
  }

  async getUsersByKitchenIdCount(kitchenId: number): Promise<number> {
    return this.prisma.count({
      where: {
        cocinaId: kitchenId
      }
    })
  }

  async getUsersByKitchenId(kitchenId: number, pagination: PaginationDto): Promise<User[]> {
    const {page, limit} = pagination;
    return this.prisma.findMany({
      skip: (page - 1) * limit,
      take: limit,
      where: {
        cocinaId: kitchenId
      }
    })
    .then(
      (users) => users.map((user) => User.fromJson(user))
    );
  }

}