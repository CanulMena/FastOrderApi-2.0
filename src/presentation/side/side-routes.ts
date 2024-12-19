import { Router } from "express";
import { PosgresSideDatasourceImpl } from "../../infrastructure/datasource/postgres-side-datasource.impl";
import { SideRepositoryImpl } from "../../infrastructure/repository/side.repository.impl";
import { SideController } from "./side-controller";


export class SideRoutes {
    
    static get routes(): Router {

        const router = Router();
        const sideDatasourceImpl = new PosgresSideDatasourceImpl();
        const sideRepositoryImpl = new SideRepositoryImpl( sideDatasourceImpl );
        const sideController = new SideController( sideRepositoryImpl );

        router.get('/', sideController.getSides);

        router.get('/:id', sideController.getSideById);

        router.post('/', sideController.postSide);

        router.delete('/:id', sideController.deleteSide);

        return router;

    }
}