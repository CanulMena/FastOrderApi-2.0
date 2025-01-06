import { PrismaClient } from "@prisma/client";
import { DishSideDatasource } from "../../domain/datasource";


export class PostgresDishSideDatasourceImpl implements DishSideDatasource {

    private readonly prisma = new PrismaClient().platilloComplemento;

    async deleteDishSide( dishId: number ): Promise<number> {
        await this.prisma.deleteMany({
            where: {
                platilloId: dishId
            }
        });
        return dishId;
    }
}