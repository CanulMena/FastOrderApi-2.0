import 'dotenv/config';
import { get } from 'env-var';
// env-var nos ayuda a crear validaciones de las variables de entorno para que no tengamos problemas.

export const envs = {
    PORT: get('PORT').required().asPortNumber(),
    PUBLIC_PATH: get('PUBLIC_PATH').required().asString(),
    JWT_SEED: get('JWT_SEED').required().asString(),
    MAILER_SERVICE: get('MAILER_SERVICE').required().asString(),
    MAILER_EMAIL: get('MAILER_EMAIL').required().asString(),
    MAILER_SECRET_KEY: get('MAILER_SECRET_KEY').required().asString(),
    WEB_SERVICE_URL: get('WEB_SERVICE_URL').required().asString(),
    SEND_EMAIL: get('SEND_EMAIL').default('false').asBool(),
}