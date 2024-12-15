import { Router } from "express";
import { envs } from "../../configuration";
import { AuthController } from "./auth-controller";
import { EmailService } from "../email/email-service";
import { PosgresUserDataSourceImpl } from "../../infrastructure/datasource/index";
import { UserRepositoryImpl } from '../../infrastructure/repository/index';
import { SendEmailValidationLink, ValidateEmail } from '../../domain/use-cases/auth/index';

export class AuthRoutes {

  static get routes(): Router {
    const router = Router();

    const userDatasourceImpl = new PosgresUserDataSourceImpl();
    const userRepositoryImpl = new UserRepositoryImpl(userDatasourceImpl);
    const emailService = new EmailService(
      envs.MAILER_SERVICE,
      envs.MAILER_EMAIL,
      envs.MAILER_SECRET_KEY
    );
    const sendEmailValidationLink = new SendEmailValidationLink(
      emailService,
      envs.WEB_SERVICE_URL
    );
    const validateUserEmail = new ValidateEmail(userRepositoryImpl);
    const authController = new AuthController(
      userRepositoryImpl,
      sendEmailValidationLink,
      validateUserEmail
    );
    router.post('/register', authController.registerUser);
    router.post('/login', authController.loginUser);
    router.get('/validate-email/:token', authController.validateEmail);
    //existe parametros de consulta  /ruta?id=1
    //existen parametros de ruta /:id
    //existen segmentos de ruta /ruta/segmento
    return router;
  }
}