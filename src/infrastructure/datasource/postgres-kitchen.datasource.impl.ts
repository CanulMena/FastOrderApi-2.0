import { PrismaClient } from '@prisma/client';
import { KitchenDatasource } from '../../domain/datasource/index';
import { CreateKitchenDto } from '../../domain/dtos/kitchen/index';
import { Kitchen } from '../../domain/entities/index';
import { UpdateKitchenDto } from '../../domain/dtos/kitchen/update-kitchen.dto';
import { CustomError } from '../../domain/errors';

export class PostgresKitchenDatasourceImpl implements KitchenDatasource {

  private readonly prisma = new PrismaClient().cocina;

  async createKitchen( createKitchenDto : CreateKitchenDto ) : Promise<Kitchen> {
    const kitchenCreated = await this.prisma.create({
      data: {
        nombre: createKitchenDto.name,
        direccion: createKitchenDto.address,
        telefono: createKitchenDto.phone
      }
    });
    
    return Kitchen.fromJson(kitchenCreated);;
  }

  async getKitchens() : Promise<Kitchen[]>{
    return await this.prisma.findMany().then( kitchens => kitchens.map( kitchen => Kitchen.fromJson(kitchen) ) );
  }

  async getKitchenById( kitchenId: number ) : Promise<Kitchen>{
    const kitchen = await this.prisma.findUnique({
      where: {
        id: kitchenId
      }, 
      include: {
        _count: {
          select: {
            platillos: true, 
            complementos: true, 
            clientes: true, 
            usuarios: true
          }
        }
      }
    });

    if( !kitchen ){
      throw CustomError.notFound('Kitchen ID does not exist');
    }
    
    return Kitchen.fromJson(kitchen);
  }

  async deleteKitchen( kitchenId: number ) : Promise<Kitchen>{
    await this.getKitchenById(kitchenId);
    const kitchen = await this.prisma.delete({
      where: {
        id: kitchenId
      }
    });
    return Kitchen.fromJson(kitchen);
  }

  async updateKitchen( UpdateKitchenDto: UpdateKitchenDto ) : Promise<Kitchen>{
    await this.getKitchenById(UpdateKitchenDto.KitchenId)
    const kitchen = await this.prisma.update({
      where: {
        id: UpdateKitchenDto.KitchenId
      },
      data: {
        nombre: UpdateKitchenDto.name,
        direccion: UpdateKitchenDto.address,
        telefono: UpdateKitchenDto.phone
      }
    })
    return Kitchen.fromJson(kitchen);
  }

}