import { Request, Response } from 'express';
import { UserRepository, KitchenRepository, JwtRepository } from '../../domain/repositories';
import { LoginUserDto, RefreshTokenDto, RegisterUserDto } from '../../domain/dtos/auth';
import { CustomError } from '../../domain/errors';
import { CreateUser, LoginUser, SendEmailValidationLink, ValidateEmail, RefreshToken, GetUsersByIdKitchen } from '../../domain/use-cases/auth/index';
import { User } from '../../domain/entities';
import { PaginationDto } from '../../domain/dtos';


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

  public ping = async (req: Request, res: Response) => {
    res.status(200).json({ message: 'active' });
    return 
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

  public refreshToken = async (req: Request, res: Response) => {
    const { refreshToken } = req.body;
    const [ error ] = RefreshTokenDto.create(req.body);
    if( error ) {
      res.status(400).json({ error: error });
      return;
    }
    new RefreshToken(this.jwtRepository)
    .execute(refreshToken)
    .then( response => res.status(200).json(response))
    .catch( error => this.handleError(error, res));
  }

  public checkAuthStatus = async (req: Request, res: Response) => {
    const user = req.body.user as User;
    const { passwordHash, ...userWithoutPassword } = user;
    res.status(200).json({user: userWithoutPassword});
  }
  
  public getUsersByIdKitchen = (req: Request, res: Response) => {
    const user = req.body.user as User;
    const kitchenId = +req.params.kitchenId;
    const { page = 1, limit = 10 } = req.query;
    const [ error, paginationDto ] = PaginationDto.create(+page, +limit);
    if (error) {
      res.status(400).json({ error });
      return;
    }

    new GetUsersByIdKitchen(this.userRepositoryImpl)
    .execute(user, kitchenId, paginationDto!)
    .then((users) => res.status(200).json(users))
    .catch((error) => this.handleError(error, res));
  }
} 