import { PrismaClient } from "@prisma/client";
import { SideDatasource } from "../../domain/datasource/side.datasource";
import { CreateSideDto } from "../../domain/dtos/side/create-side.dto";
import { Side } from "../../domain/entities";
import { CustomError } from "../../domain/errors";

export class PosgresSideDatasourceImpl implements SideDatasource {

    private readonly prisma = new PrismaClient().complemento;

    async createSide( createSideDto: CreateSideDto ) : Promise<Side> {
        const sideObj = await this.prisma.create({
            data: {
                nombre: createSideDto.name,
                descripcion: createSideDto.description || null,
                rutaImagen: createSideDto.imageUrl || null,
                cocinaId: createSideDto.kitchenId,
            }
        });
        const side = Side.fromJson(sideObj);
        return side;
    }

    async getSides() : Promise<Side[]> {
        return await this.prisma.findMany().then( sides => sides.map( side => Side.fromJson(side) ) );
    }

    async getSideById( sideId: number ) : Promise<Side> {
        const side = await this.prisma.findUnique({
            where: {
                id: sideId
            }
        });

        if( !side ){
            throw CustomError.notFound('Side ID does not exist');
        }

        return Side.fromJson(side);
    }

    async deleteSide( sideId: number ) : Promise<Side> {
        await this.getSideById(sideId);
        const side = await this.prisma.delete({
            where: {
                id: sideId
            }
        });
        return Side.fromJson(side);
    }

    // async updateSide( UpdateSide: Upd): Promise<Side> {
    //     await this.getSideById(Updt)
    // }
}