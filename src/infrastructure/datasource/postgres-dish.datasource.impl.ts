import { DishDatasource } from "../../domain/datasource";
import { Dish } from "../../domain/entities";
import { PrismaClient } from '@prisma/client';
import { CreateDishDto } from "../../domain/dtos/dish/create-dish.dto";

export class PostgresDishDatasourceImpl implements DishDatasource {

  private readonly prisma = new PrismaClient().platillo;

  async createDish(registerDishDto: CreateDishDto): Promise<Dish> {
    const dishCreated = await this.prisma.create({
      data: {
        nombre: registerDishDto.name,
        precioMedia: registerDishDto.pricePerHalfServing,
        precioEntera: registerDishDto.pricePerServing,
        rutaImagen: registerDishDto.imagePath || null,
        cocinaId: registerDishDto.kitchenId,
        complementos: {
          create: registerDishDto.sidesId.map((sideId) => (
            
            {
              complemento: {
                connect: {
                  id: sideId
                }
              }
            }
          
        ))
        }
      },
      include: {
        complementos: true
      }
    });

    return Dish.fromJson(dishCreated);
  }
}