import { PrismaClient } from "@prisma/client";
import { UserDatasource } from "../../domain/datasource/index";
import { User } from "../../domain/entities/index";
import { Kitchen } from '../../domain/entities/kitchen.entity';

export class PosgresUserDataSourceImpl implements UserDatasource {

  private readonly prisma = new PrismaClient().usuario;

  async createUser(user: any): Promise<User> { // Poder crear un usuario con una o sin una cocina

    const userCreated = await this.prisma.create({ //Esta creando un usuario con la cocina que se le asigno. 
      data: {
        email: user.email,
        contrasena: user.passwordHash,
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