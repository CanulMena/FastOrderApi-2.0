import jwt from 'jsonwebtoken';
import { envs } from './envs';

const JWT_SEED = envs.JWT_SEED; //!Esto esta generando una dependencia oculta

export const jwtAdapter = {
  generateToken: (payload: any, expiresIn: string = "2h") => {
    //envolvemos la función en una promesa para poder usar async/await y poder obtener valores en el retorno
    return new Promise( (resolve) => {
      jwt.sign(payload, JWT_SEED, { expiresIn }, (err, token) => {
        if(err) return resolve(err);
        return resolve(token);
      });
    });
  },

  validateToken: (token: string) => {
    return new Promise( (resolve) => {
      jwt.verify(token, JWT_SEED, (err, decoded) => {
        if(err) return resolve(null);
        return resolve(decoded);
      });
    });
  }
}