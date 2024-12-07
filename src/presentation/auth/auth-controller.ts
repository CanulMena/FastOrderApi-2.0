import { Request, Response } from 'express';
import { UserRepository } from '../../domain/repositories';
import { CreateUser } from '../../domain/use-case/user/create-user';
import { RegisterUserDto } from '../../domain/dtos/auth';
import { CustomError } from '../../domain/errors';

//* En el controlador, no necesitas preocuparte por la lógica de encriptado. Solo orquestas los flujos y llamas al caso de uso

export class AuthController {
  constructor(
    public userRepositoryImpl: UserRepository
  ){}

  private handleError(error: unknown, res: Response) {
    if (error instanceof CustomError) {
      return res.status(error.statusCode).json({ error: error.message });
    }
    console.log(`${error}`);
    return res.status(500).json({ error: 'Internal Server Error' });
  }

  public registerUser = async (req: Request, res: Response) => {
    const { name, email, password, rol, kitchenId } = req.body;
    const [ error, registerUserDto ] = RegisterUserDto.create({ name, email, password, rol, kitchenId });
    if( error ) {
      res.status(400).json({ error: error });
      return
    }
    new CreateUser( this.userRepositoryImpl )
    .exucute(registerUserDto!)
    .then( user => {
      const { passwordHash, ...userEntity } = user;
      res.status(201).json({ 
        user: userEntity,
        token: 'token'
      });
    })
    .catch( error => this.handleError(error, res));
  }

  public loginUser = async (req: Request, res: Response) => {
    res.status(200).json({ message: 'loginUser' });
  }

  public validateEmail = async (req: Request, res: Response) => {
    res.status(200).json({ message: 'validateEmail' });
  }

} 