import { CreateKitchenDto } from '../dtos';
import { Kitchen } from '../entities/index';

export abstract class KitchenDatasource {
  abstract createKitchen( kitchen : CreateKitchenDto ) : Promise<Kitchen>;
  abstract getKitchens() : Promise<Kitchen[]>;
  abstract getKitchenById( kitchenId: number ) : Promise<Kitchen>;
  abstract deleteKitchen( kitchenId: number ) : Promise<Kitchen>;
  abstract updateKitchen( kitchen: CreateKitchenDto ) : Promise<Kitchen>;
}