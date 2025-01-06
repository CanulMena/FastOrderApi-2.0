import { DishDatasource } from "../../domain/datasource";
import { Dish } from "../../domain/entities";
import { PrismaClient } from '@prisma/client';
import { CreateDishDto } from "../../domain/dtos/dish/create-dish.dto";
import { CustomError } from "../../domain/errors";
import { disconnect } from "process";

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

  async getDishById( dishId: number ): Promise<Dish> {
    const dish = await this.prisma.findUnique({  // findUnique is a Prisma method that returns a single record that matches the unique key value provided
      where: {
        id: dishId
      },
      include: {
        complementos: true
      }
    });

    if ( !dish ) {
      throw CustomError.notFound('Dish ID does not exist');
    }

    return Dish.fromJson(dish);
  }


  async deleteDish(dishId: number): Promise<Dish> {
    await this.getDishById(dishId);
    const dish = await this.prisma.delete({
      where: {
        id: dishId
      },
      
    });
    return Dish.fromJson(dish);
  }
}