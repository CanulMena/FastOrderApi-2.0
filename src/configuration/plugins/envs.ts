import 'dotenv/config';
import { get } from 'env-var';
// env-var nos ayuda a crear validaciones de las variables de entorno para que no tengamos problemas.

export const envs = {
    PORT: get('PORT').required().asPortNumber(),
    PUBLIC_PATH: get('PUBLIC_PATH').required().asString(),
    JWT_SEED: get('JWT_SEED').required().asString(),
    REFRESH_JWT_SEED: get('REFRESH_JWT_SEED').required().asString(),
    MAILER_SERVICE: get('MAILER_SERVICE').required().asString(),
    MAILER_EMAIL: get('MAILER_EMAIL').required().asString(),
    MAILER_SECRET_KEY: get('MAILER_SECRET_KEY').required().asString(),
    WEB_SERVICE_URL: get('WEB_SERVICE_URL').required().asString(),
    SEND_EMAIL: get('SEND_EMAIL').default('false').asBool(),
    // CLOUDINARY_URL: get('CLOUDINARY_URL').required().asString(),
    CLOUDINARY_CLOUD_NAME: get('CLOUDINARY_CLOUD_NAME').required().asString(),
    CLOUDINARY_API_KEY: get('CLOUDINARY_API_KEY').required().asString(),
    CLOUDINARY_API_SECRET: get('CLOUDINARY_API_SECRET').required().asString(),
    CORS_ORIGINS: get('CORS_ORIGINS')
        .required()
        .asString()
        .split(',') //los divide por cada coma
        .map(origin => origin.trim()), //quita espacios en cada elemetno del array

    WEB_SERVICE_DOMAIN: get('WEB_SERVICE_DOMAIN').required().asString(),
    PRODUCTION: get('PRODUCTION').default('false').asBool(),
}