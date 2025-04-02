import { Router } from "express";
import { envs, rolesConfig } from "../../configuration";
import { AuthController } from "./auth-controller";
import { EmailService } from "../email/email-service";
import { PostgresUserDataSourceImpl, PostgresKitchenDatasourceImpl, PostgresJwtDatsourceImpl } from "../../infrastructure/datasource/index";
import { KitchenRepositoryImpl, UserRepositoryImpl, JwtRepositoryImpl } from '../../infrastructure/repository/index';
import { SendEmailValidationLink, ValidateEmail } from '../../domain/use-cases/auth/index';
import { AuthMiddleware } from "../middlewares/index";

export class AuthRoutes {

  static get routes(): Router {
    const router = Router();

    const kitchenDatasourceImpl = new PostgresKitchenDatasourceImpl();
    const kitchenRepositoryImpl = new KitchenRepositoryImpl(kitchenDatasourceImpl);

    const userDatasourceImpl = new PostgresUserDataSourceImpl();
    const userRepositoryImpl = new UserRepositoryImpl(userDatasourceImpl);

    const postgresJwtDataSourceImpl = new PostgresJwtDatsourceImpl();
    const jwtRepositoryImpl = new JwtRepositoryImpl(postgresJwtDataSourceImpl);

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
      jwtRepositoryImpl,
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

    router.post('/refresh-token', authController.refreshToken);//no es necesario implementar ningun tipo de middleware

    router.post('/check-auth-status', authController.checkAuthStatus)
    //existe parametros de consulta  /ruta?id=1
    //existen parametros de ruta /:id
    //existen segmentos de ruta /ruta/segmento

    return router;
  }
}