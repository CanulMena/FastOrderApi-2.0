import jwt from 'jsonwebtoken';

export const jsonwebtokenAdapter = {
  generateToken: (payload: any, secret: string, expiresIn: string = "2h") => {
    //envolvemos la función en una promesa para poder usar async/await y poder obtener valores en el retorno
    return new Promise( (resolve) => {
      jwt.sign(payload, secret, { expiresIn }, (err, token) => {
        if(err) return resolve(err);
        return resolve(token);
      });
    });
  }
}