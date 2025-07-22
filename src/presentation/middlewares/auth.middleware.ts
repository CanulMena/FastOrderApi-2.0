import { Request, Response, NextFunction } from "express";
import { envs, jwtAdapter } from "../../configuration";
import { User } from "../../domain/entities";
import { UserRepository } from "../../domain/repositories";
/**
 * * validateKitchenAccess puede ser utilizado en cualquier que dentro del body tenga un campo kitchenId y dentro del url tenga un parametro kitchenId.
 * * si el kitchenId no se encuentra en el body o en el url, se realiza la validación dentro del caso de uso.
 */

export class AuthMiddleware {

  constructor(
    private readonly userRepository: UserRepository
  ) { }

  public validateJWT = async (req: Request, res: Response, next: NextFunction): Promise<void> => { //Lo que hace este middleware es validar el token y si es valido, agrega el usuario al request
    try {
      let token = req.cookies?.accessToken;

      if (!token) {
        const authorization = req.header('Authorization');
        if (!authorization) {
          res.status(401).json({ error: 'No token provided' });
          return;
        }

        if (!authorization.startsWith('Bearer ')) {
          res.status(401).json({ error: 'Invalid Bearer token' });
          return;
        }

        token = authorization.split(' ').at(1) || ''; //tomamos el token del header      
      }

      const payload = await jwtAdapter.validateToken<{ id: number }>(token, envs.JWT_SEED); // sacamos el payload del token { id: number }
      if (!payload) {
        res.status(401).json({ error: 'Invalid token' });
        return;
      }

      const userFound = await this.userRepository.getUserById(payload.id);
      if (!userFound) {
        res.status(401).json({ error: 'Invalid user in token' });
        return;
      }

      req.body.user = User.fromJson({
        "id": userFound.userId,
        "nombre": userFound.name,
        "email": userFound.email,
        "emailValid": userFound.emailVerified,
        "contrasena": userFound.passwordHash,
        "rol": userFound.rol,
        "cocinaId": userFound.kitchenId,
      });

      next(); // Continuar al siguiente middleware
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };

  public validateRole = (requiredRoles: string[]) => {
    return (req: Request, res: Response, next: NextFunction): void => {
      const user = req.body.user as User;
      if (!user) {
        res.status(403).json({ error: 'User not found in the request' });
        return;
      }

      if (!requiredRoles.includes(user.rol)) { //si el rol del usuario no esta en los roles permitidos
        res.status(403).json({ error: `${user.rol} user is not the required role. Allowed roles: ${requiredRoles.join(', ')}` });
        return;
      }

      next();
    };
  }
//* para utilizar este middleware el usuario tiene que tener en el body o en la url un campo kitchenId
  public validateKitchenAccess = (req: Request, res: Response, next: NextFunction): void => { //middleware para validar que el usuario tenga acceso a la cocina
    const user = req.body.user as User; // Usuario autenticado
    const kitchenIdFromRequest = req.body.kitchenId || req.params.kitchenId || req.query.kitchenId;
  
    if (!user) {
      res.status(403).json({ error: "User not found in the request" });
      return;
    }
  
    // Si el rol es Super Admin, tiene acceso a todas las cocinas
    if (user.rol === 'SUPER_ADMIN') {
      return next();
    }

    if(!kitchenIdFromRequest){
      res.status(403).json({ error: "Access denied. Kitchen not found in the request." });
      return;
    }
  
    // Si no pertenece a la cocina especificada, denegar acceso
    if (!kitchenIdFromRequest || user.kitchenId !== parseInt(kitchenIdFromRequest as string, 10)) { //si el id de la cocina del usuario no es igual al id de la cocina de la peticion
      res.status(403).json({ error: "Access denied. User does not belong to this kitchen." });
      return;
    }
  
    // Si todo está bien, continuar
    next();
  };
  

}