import { PrismaClient } from '@prisma/client';
import { KitchenDatasource } from '../../domain/datasource/index';
import { CreateKitchenDto } from '../../domain/dtos/kitchen/index';
import { Kitchen } from '../../domain/entities/index';
import { UpdateKitchenDto } from '../../domain/dtos/kitchen/update-kitchen.dto';

export class PostgresKitchenDatasourceImpl implements KitchenDatasource {

  private readonly prisma = new PrismaClient().cocina;

  async createKitchen( createKitchenDto : CreateKitchenDto ) : Promise<Kitchen> {
    const kitchenObj = await this.prisma.create({
      data: {
        nombre: createKitchenDto.name,
        direccion: createKitchenDto.address,
        telefono: createKitchenDto.phone
      }
    });
    const kitchen = Kitchen.fromJson(kitchenObj);
    return kitchen;
  }

  async getKitchens() : Promise<Kitchen[]>{
    return await this.prisma.findMany().then( kitchens => kitchens.map( kitchen => Kitchen.fromJson(kitchen) ) );
  }

  async getKitchenById( kitchenId: number ) : Promise<Kitchen>{
    const kitchen = await this.prisma.findUnique({
      where: {
        id: kitchenId
      }
    });

    if( !kitchen ){
      throw new Error(`Kitchen with id ${kitchenId} not found`);
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
    await this.getKitchenById(UpdateKitchenDto.id)
    const kitchen = await this.prisma.update({
      where: {
        id: UpdateKitchenDto.id
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