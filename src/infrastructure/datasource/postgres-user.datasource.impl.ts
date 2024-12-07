import { PrismaClient } from "@prisma/client";
import { UserDatasource } from "../../domain/datasource/index";
import { User } from "../../domain/entities/index";

export class PosgresUserDataSourceImpl implements UserDatasource {

  private readonly prisma = new PrismaClient().usuario;

  async createUser(user: any): Promise<User> {

    const userCreated = await this.prisma.create({ 
      data: {
        nombre: user.name,
        email: user.email, //Me tira error si el email existe
        contrasena: user.password,
        rol: user.rol,
        cocinaId: user.kitchenId || null,
      }
    });
    
    return User.fromJson(userCreated);
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
  updateUser(user: any): Promise<User> {
    throw new Error("Method not implemented.");
  }

}