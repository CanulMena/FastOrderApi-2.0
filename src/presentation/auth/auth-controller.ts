import { CookieOptions, Request, Response } from 'express';
import { UserRepository, KitchenRepository, JwtRepository } from '../../domain/repositories';
import { LoginUserDto, RefreshTokenDto, RegisterUserDto, PaginationDto } from '../../domain/dtos';
import { CreateUser, SendEmailValidationLink, ValidateEmail, RefreshToken, 
  GetUsersByIdKitchen, LoginUniversalUser, LogoutUser } from '../../domain/use-cases/index';
import { CustomError } from '../../domain/errors';
import { User } from '../../domain/entities';
import { envs } from '../../configuration';

export class AuthController {
  constructor(
    public kitchenRepository: KitchenRepository,
    public userRepositoryImpl: UserRepository,
    public jwtRepository: JwtRepository,
    public sendEmailValidationLink: SendEmailValidationLink,
    public validateUserEmail: ValidateEmail
  ){}

  // ✅ Método centralizado para opciones de cookies
  private getCookieOptions(maxAge: number): CookieOptions {
  return {
    httpOnly: true,
    secure: envs.PRODUCTION,
    sameSite: envs.PRODUCTION ? 'none' : 'lax',
    maxAge,
    path: '/',
    ...(envs.PRODUCTION ? { domain: envs.WEB_SERVICE_DOMAIN } : {}),
  };
}

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
      res.status(400).json({ error });
      return;
    }
    new CreateUser(
      this.kitchenRepository,
      this.userRepositoryImpl,
      this.sendEmailValidationLink
    )
    .exucute(registerUserDto!)
    .then(user => res.status(200).json(user))
    .catch(error => this.handleError(error, res));
  }

  public loginUser = async (req: Request, res: Response) => {
    const [ error, loginUserDto ] = LoginUserDto.create(req.body);
    if( error ) {
      res.status(400).json({ error });
      return;
    }

    const clientType = req.headers['x-client-type'];
    const deviceName = req.headers['x-device-name'] as string || 'Unknown Device';
    const deviceOS = req.headers['x-device-os'] as string || 'Unknown OS';
    const ipAddress = req.ip;
    
    new LoginUniversalUser(this.userRepositoryImpl, this.jwtRepository)
    .execute(loginUserDto!, clientType as string, { deviceName, deviceOS, ipAddress })
    .then(response => {
      if (response.setCookies) {
        // ✅ Usamos opciones centralizadas
        res.cookie('accessToken', response.accessToken, this.getCookieOptions(1000 * 60 * 60 * 2)); // 2h
        res.cookie('refreshToken', response.refreshToken, this.getCookieOptions(1000 * 60 * 60 * 24 * 7)); // 7d
        res.status(200).json({ user: response.user });
      } else {
        res.status(200).json({
          user: response.user, 
          accessToken: response.accessToken,
          refreshToken: response.refreshToken
        });
      }
    })
    .catch(error => this.handleError(error, res));
  }

  public validateEmail = async (req: Request, res: Response) => {
    const { token } = req.params;
    this.validateUserEmail
    .execute(token)
    .then(response => res.status(200).json(response))
    .catch(error => this.handleError(error, res));
  }

  public refreshToken = async (req: Request, res: Response) => {
    let refreshToken = req.cookies?.refreshToken;

    if (!refreshToken) {
      const [ error ] = RefreshTokenDto.create(req.body);
      if( error ) {
        res.status(400).json({ error });
        return;
      }
      refreshToken = req.body.refreshToken;
    }

    if (!refreshToken) {
      res.status(400).json({ error: 'Missing refreshToken' });
      return;
    }

    new RefreshToken(this.jwtRepository)
    .execute(refreshToken)
    .then(response => {
      if (req.headers['x-client-type'] === 'web') {
        // ✅ Reutilizamos las mismas opciones
        res.cookie('accessToken', response.accessToken, this.getCookieOptions(1000 * 60 * 60 * 2));
        res.cookie('refreshToken', response.refreshToken, this.getCookieOptions(1000 * 60 * 60 * 24 * 7));
        res.status(200).json({ message: 'Tokens refreshed successfully' });
      } else {
        res.status(200).json(response);
      }
    })
    .catch(error => this.handleError(error, res));
  }

  public checkAuthStatus = async (req: Request, res: Response) => {
    const user = req.body.user as User;
    const { passwordHash, ...userWithoutPassword } = user;
    res.status(200).json({ user: userWithoutPassword });
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
    .then(users => res.status(200).json(users))
    .catch(error => this.handleError(error, res));
  }

  public logoutUser = async (req: Request, res: Response) => {
    const clientType = req.headers['x-client-type'];
    const refreshToken = req.cookies?.refreshToken || req.body.refreshToken;

    if (!refreshToken) {
      res.status(400).json({ error: 'Missing refreshToken' });
      return;
    }

    new LogoutUser(this.jwtRepository)
    .execute(refreshToken)
    .then(response => {
      if (clientType === 'web') {
        res.clearCookie('accessToken');
        res.clearCookie('refreshToken');
        res.status(200).json({ message: 'Logged out successfully' });
      } else {
        res.status(200).json(response);
      }
    });
  }
}
