import { DishDatasource } from "../../domain/datasource";
import { Dish } from "../../domain/entities";
import { PrismaClient } from '@prisma/client';
import { CustomError } from "../../domain/errors";
import { PaginationDto, UpdateDishDto, CreateDishDto } from "../../domain/dtos";

export class PostgresDishDatasourceImpl implements DishDatasource {

  private readonly prisma = new PrismaClient().platillo;

  async createDish(registerDishDto: CreateDishDto): Promise<Dish> {
    const dishCreated = await this.prisma.create({
      data: {
        nombre: registerDishDto.name,
        precioMedia: registerDishDto.pricePerHalfServing,
        precioEntera: registerDishDto.pricePerServing,
        racionesDisponibles: registerDishDto.availableServings,
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
      throw CustomError.notFound(`Dish with id ${dishId} does not exist`);
    }

    return Dish.fromJson(dish);
  }

    async getDishes( paginationDto: PaginationDto ) : Promise<Dish[]> {
        const { page, limit } = paginationDto;
        return await this.prisma
        .findMany({
            skip: (page - 1) * limit,
            take: limit
        })
        .then( 
            dishes => dishes.map( dish => Dish.fromJson(dish) ) 
        );
    }

    async getDishesById( dishIds: number[] ) : Promise<Dish[]> {
        return await this.prisma
        .findMany({
            where: {
                id: {
                    in: dishIds
                }
            }
        })
        .then( 
            dishes => dishes.map( dish => Dish.fromJson(dish) ) 
        );
    }

    async getDishesCount() : Promise<number> {
        return await this.prisma.count();
    }

    async getDishesByKitchenIdCount( kitchenId: number ) : Promise<number> {
        return await this.prisma.count({
            where: {
                cocinaId: kitchenId
            }
        });
    }

    async getDishesByKitchenId( kitchenId: number, paginationDto: PaginationDto ) : Promise<Dish[]> {
        const { page, limit } = paginationDto;
        return await this.prisma
        .findMany({
            where: {
                cocinaId: kitchenId
            },
            skip: (page - 1) * limit,
            take: limit,
            include: {
                complementos: true
            }
        })
        .then( 
            dishes => dishes.map( dish => Dish.fromJson(dish) )
        );
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

  async updateDish( updateDishDto: UpdateDishDto): Promise<Dish> {
    await this.getDishById(updateDishDto.dishId);

    const dishUpdated = await this.prisma.update({
      where: {
        id: updateDishDto.dishId
      },
      data: {
        nombre: updateDishDto.name,
        precioMedia: updateDishDto.pricePerHalfServing,
        precioEntera: updateDishDto.pricePerServing,
        racionesDisponibles: updateDishDto.availableServings,
        rutaImagen: updateDishDto.imagePath,
      },
      include: {
        complementos: true
      }
    });

    return Dish.fromJson(dishUpdated);
  }

}