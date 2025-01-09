import { PrismaClient } from "@prisma/client";
import { DishSideDatasource } from "../../domain/datasource";


export class PostgresDishSideDatasourceImpl implements DishSideDatasource {

    private readonly prisma = new PrismaClient().platilloComplemento;

    async deleteSidesByDishId( dishId: number ): Promise<number> {
        await this.prisma.deleteMany({
            where: {
                platilloId: dishId
            }
        });
        return dishId;
    }

    async createMany( dishId: number, sidesId: number[] ): Promise<void> {
        const dishSides = sidesId.map( sideId => {
            return {
                platilloId: dishId,
                complementoId: sideId
            }
        });

        await this.prisma.createMany({
            data: dishSides
        });
    }

}