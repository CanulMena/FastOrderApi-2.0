import { Request, Response } from 'express';
import { UserRepository, KitchenRepository, JwtRepository } from '../../domain/repositories';
import { LoginUserDto, RegisterUserDto } from '../../domain/dtos/auth';
import { CustomError } from '../../domain/errors';
import { CreateUser, LoginUser, SendEmailValidationLink, ValidateEmail } from '../../domain/use-cases/auth/index';

export class AuthController {
  constructor(
    public kitchenRepository: KitchenRepository,
    public userRepositoryImpl: UserRepository,
    public jwtRepository: JwtRepository,
    public sendEmailValidationLink: SendEmailValidationLink,
    public validateUserEmail: ValidateEmail
  ){}

  private handleError(error: unknown, res: Response) {
    if (error instanceof CustomError) {
      return res.status(error.statusCode).json({ error: error.message });
    }
    console.log(`${error}`);
    return res.status(500).json({ error: 'Internal Server Error' });
  }

  public registerUser = async (req: Request, res: Response) => {
    
    const [ error, registerUserDto ] = RegisterUserDto.create(req.body);
    if( error ) {
      res.status(400).json({ error: error });
      return
    }
    new CreateUser(
      this.kitchenRepository,
      this.userRepositoryImpl,
      this.sendEmailValidationLink
    )
    .exucute(registerUserDto!)
    .then( user => res.status(200).json(user))
    .catch( error => this.handleError(error, res));
  }

  public loginUser = async (req: Request, res: Response) => {
    const [ error, loginUserDto ] = LoginUserDto.create(req.body);
    if( error ) {
      res.status(400).json({ error: error }); //400 Bad Request
      return
    }
    new LoginUser( 
      this.userRepositoryImpl,
      this.jwtRepository
    )
    .execute(loginUserDto!)
    .then( response => res.status(200).json(response))
    .catch( error => this.handleError(error, res));
  }

  public validateEmail = async (req: Request, res: Response) => {
    const { token } = req.params;
    this.validateUserEmail
    .execute(token)
    .then( response => res.status(200).json(response))
    .catch( error => this.handleError(error, res));
  }

} 