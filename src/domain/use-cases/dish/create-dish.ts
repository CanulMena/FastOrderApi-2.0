import { UploadedFile } from "express-fileupload";
import { CreateDishDto } from "../../dtos/dish/index";
import { CustomError } from "../../errors";
import { DishRepository, SideRepository } from "../../repositories";
import { FileUploadSingle, DeleteUploadedFile } from "../file-upload";

interface CreateDishUseCase {
  execute(
    dish: CreateDishDto,
    file: UploadedFile,
    folder: string,
    validExtensions: string[]
  ): Promise<object>
}

export class CreateDish implements CreateDishUseCase {

  constructor(
    private dishRepository: DishRepository,
    private SideRepository: SideRepository,
    private fileUploadSingle: FileUploadSingle,
    private deleteUploadedFile: DeleteUploadedFile
  ) {}

  async execute(
    createDishDto: CreateDishDto,
    file: UploadedFile, 
    folder: string = 'uploads',
    validExtensions: string[] = ['jpg', 'jpeg', 'png']
  ): Promise<object> {

    const existingDish = await this.dishRepository.findDishByNameAndKitchenId(
      createDishDto.name,
      createDishDto.kitchenId
    )

    if (existingDish) {
      throw CustomError.badRequest(`Dish with name ${createDishDto.name} already exists in this kitchen`);
    }

    //ejeutar el fileUploadSingle para subir la imagen del platillo
    const fileUploaded = await this.fileUploadSingle.execute( file, folder, validExtensions );
    createDishDto.imagePath = fileUploaded.url || fileUploaded.fileName;
    /*Obtener todos los sides por IDs para validar para que el side exista y obtener el kitchenId de cada side
    y comparar que el kitchenId de cada side pertenece a el mismo kitchenId de la cocina al que se le quiere agregar*/
    const sides = await Promise.all(
      createDishDto.sidesId.map(async (sideId) => {
          const side = await this.SideRepository
          .getSideById(sideId)
          return side;
      })
    );

    //validar que sus kitchenId de cada side sea igual al kitchenId de la cocina al que se le quiere agregar.
    const invalidSides = sides.filter( (side) => side.kitchenId !== createDishDto.kitchenId); // devuleve los sides que no pertenecen a la cocina

    if (invalidSides.length > 0) {
      const invalidSideIds = invalidSides.map((side) => side.sideId).join(', ');
      throw CustomError.unAuthorized(
        `The following ${invalidSideIds.length > 1 ? 'sides' : 'side'} do not belong to the same kitchen: ${invalidSideIds}`
      );
    }

    try{
      const dishCreated = await this.dishRepository.createDish(createDishDto);
      return {dish: dishCreated}
    } catch (error) {
      const deleteUploadedFile = await this.deleteUploadedFile.execute(fileUploaded.publicId);
      //?--> Estaría ultra chido hacer que si falla el eliminar la imagen subida se mande un correo o algo así al admin.
      throw CustomError.internalServer(`Error creating dish - deleteUploadedFile: ${deleteUploadedFile.result}`);
    }

  }
}