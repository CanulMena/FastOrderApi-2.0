import { Request, Response } from 'express';
import { UserRepository } from '../../domain/repositories';
import { CreateUser } from '../../domain/use-case/user/create-user';

export class UserController {
  constructor(
    public userRepositoryImpl: UserRepository
  ){}
 
  public postUser = async (req: Request, res: Response) => {
    const { email, passwordHash, rol, kitchenId } = req.body;

    if(!email) {
      res.status(400).json({ error: 'email is required' });
      return;
    }

    if(!passwordHash) {
      res.status(400).json({ error: 'password is required' });
      return;
    }

    if(!rol) {
      res.status(400).json({ error: 'rol is required' });
      return;
    }

    if (rol !== 'ADMIN' && rol !== 'OPERATOR' && rol !== 'DELIVERY' && rol !== 'SUPER_ADMIN') {
      res.status(400).json({ error: 'rol is not a valid value' });
      return;
    }

    if(kitchenId && typeof kitchenId !== 'number') {
      res.status(400).json({ error: 'kitchenId is not a number' });
      return;
    }

    new CreateUser( this.userRepositoryImpl )
    .exucute({ email, passwordHash, rol, kitchenId })
    .then( user => res.status(201).json(user) )
    .catch( error => res.status(404).json({ error: error.message }) ); // 404 Not Found
  }

} 