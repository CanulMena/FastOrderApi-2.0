import jwt from 'jsonwebtoken';
import { envs } from './envs';

const JWT_SEED = envs.JWT_SEED; //!Esto esta generando una dependencia oculta

export const jwtAdapter = {
    generateToken: (payload: any, expiresIn: string = "2h"): Promise<string> => {
    //envolvemos la función en una promesa para poder usar async/await y poder obtener valores en el retorno
    return new Promise((resolve, reject) => {
      jwt.sign(payload, JWT_SEED, { expiresIn }, (err, token) => {
        if (err || !token) return reject(err);
        return resolve(token);
      });
    });
  },

  validateToken<T>(token: string): Promise<T | null> {
    return new Promise((resolve) => {
      jwt.verify(token, JWT_SEED, (err, decoded) => {
        if(err) return resolve(null);
        resolve(decoded as T);
      });
    });
  }
}