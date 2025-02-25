import { PrismaClient } from "@prisma/client";
import { SideDatasource } from "../../domain/datasource/index";
import { CreateSideDto, PaginationDto } from "../../domain/dtos/index";
import { Side } from "../../domain/entities/index";
import { CustomError } from "../../domain/errors";
import { UpdateSideDto } from "../../domain/dtos/side/index";

export class PostgresSideDatasourceImpl implements SideDatasource {

    private readonly prisma = new PrismaClient().complemento;

    async createSide( createSideDto: CreateSideDto ) : Promise<Side> {
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

    async getSides( paginationDto: PaginationDto ) : Promise<Side[]> {
        const { page, limit } = paginationDto;
        return await this.prisma
        .findMany({
            skip: (page - 1) * limit,
            take: limit
        })
        .then( 
            sides => sides.map( side => Side.fromJson(side) ) 
        );
    }

    async getSidesCount() : Promise<number> {
        return await this.prisma.count();
    }

    async getSidesByKitchenIdCount( kitchenId: number ) : Promise<number> {
        return await this.prisma.count({
            where: {
                cocinaId: kitchenId
            }
        });
    }

    async getSidesByKitchenId( kitchenId: number, paginationDto: PaginationDto ) : Promise<Side[]> {
        const { page, limit } = paginationDto;
        return await this.prisma
        .findMany({
            where: {
                cocinaId: kitchenId
            },
            skip: (page - 1) * limit,
            take: limit
        })
        .then( 
            sides => sides.map( side => Side.fromJson(side) )
        );
    }

    async getSideById( sideId: number ) : Promise<Side> {
        const side = await this.prisma.findUnique({
            where: {
                id: sideId
            }
        });

        if( !side ){
            throw CustomError.notFound(`Side with id ${sideId} does not exist`);
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

    async findSideByNameAndKitchenId(name: string, kitchenId: number): Promise<Side | null> {
        const side = await this.prisma.findFirst({
            where: {
                nombre: name,
                cocinaId: kitchenId,
            },
        });
        return side ? Side.fromJson(side) : null;
    }
}