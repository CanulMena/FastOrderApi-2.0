import { PrismaClient } from "@prisma/client";
import { SideDatasource } from "../../domain/datasource/index";
import { CreateSideDto } from "../../domain/dtos/side/index";
import { Side } from "../../domain/entities/index";
import { CustomError } from "../../domain/errors";
import { UpdateSideDto } from "../../domain/dtos/side/index";

export class PosgresSideDatasourceImpl implements SideDatasource {

    private readonly prisma = new PrismaClient().complemento;

    async createSide( createSideDto: CreateSideDto ) : Promise<Side> {

        //TODO: validar que no exista un side con el mismo nombre en la misma cocina

        const createdSide = await this.prisma.create({
            data: {
                nombre: createSideDto.name,
                descripcion: createSideDto.description || null,
                rutaImagen: createSideDto.imageUrl || null,
                cocinaId: createSideDto.kitchenId,
            }
        });
        return Side.fromJson(createdSide);
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

    async updateSide( UpdateSideDto: UpdateSideDto ): Promise<Side> {
        await this.getSideById(UpdateSideDto.sideId);
        const side = await this.prisma.update({
            where: {
                id: UpdateSideDto.sideId
            },
            data: {
                nombre: UpdateSideDto.name,
                rutaImagen: UpdateSideDto.imageUrl,
                descripcion: UpdateSideDto.description
            }
        })
        return Side.fromJson(side);
    }
}