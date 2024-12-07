import { CreateKitchenDto } from '../dtos/kitchen';
import { Kitchen } from '../entities/index';

export abstract class KitchenRepository {
  abstract createKitchen( kitchen : CreateKitchenDto ) : Promise<Kitchen>;
  abstract getKitchens() : Promise<Kitchen[]>;
  abstract getKitchenById( kitchenId: number ) : Promise<Kitchen>;
  abstract deleteKitchen( kitchenId: number ) : Promise<Kitchen>;
  abstract updateKitchen( kitchen: CreateKitchenDto ) : Promise<Kitchen>;
}