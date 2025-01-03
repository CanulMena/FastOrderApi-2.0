import { Router } from "express";
import { envs, rolesConfig } from "../../configuration";
import { AuthController } from "./auth-controller";
import { EmailService } from "../email/email-service";
import { PostgresUserDataSourceImpl, PostgresKitchenDatasourceImpl } from "../../infrastructure/datasource/index";
import { KitchenRepositoryImpl, UserRepositoryImpl } from '../../infrastructure/repository/index';
import { SendEmailValidationLink, ValidateEmail } from '../../domain/use-cases/auth/index';
import { AuthMiddleware } from "../middlewares/auth.middleware";

export class AuthRoutes {

  static get routes(): Router {
    const router = Router();

    const kitchenDatasourceImpl = new PostgresKitchenDatasourceImpl();
    const kitchenRepositoryImpl = new KitchenRepositoryImpl(kitchenDatasourceImpl);

    const userDatasourceImpl = new PostgresUserDataSourceImpl();
    const userRepositoryImpl = new UserRepositoryImpl(userDatasourceImpl);

    const emailService = new EmailService(
      envs.MAILER_SERVICE,
      envs.MAILER_EMAIL,
      envs.MAILER_SECRET_KEY,
      envs.SEND_EMAIL,
    );

    const sendEmailValidationLink = new SendEmailValidationLink(
      emailService,
      envs.WEB_SERVICE_URL
    );

    const validateUserEmail = new ValidateEmail(userRepositoryImpl);

    const authController = new AuthController(
      kitchenRepositoryImpl,
      userRepositoryImpl,
      sendEmailValidationLink,
      validateUserEmail
    );

    const authMiddleware = new AuthMiddleware( userRepositoryImpl );

    router.post(
      '/register',
      authMiddleware.validateJWT,
      authMiddleware.validateRole(rolesConfig.Admin),
      authMiddleware.validateKitchenAccess,
      authController.registerUser
    );

    router.post('/login',authController.loginUser); // cualquier usuario puede loguearse

    router.get('/validate-email/:token', authController.validateEmail);//no es necesario implementar ningun tipo de middleware

    //existe parametros de consulta  /ruta?id=1
    //existen parametros de ruta /:id
    //existen segmentos de ruta /ruta/segmento

    return router;
  }
}