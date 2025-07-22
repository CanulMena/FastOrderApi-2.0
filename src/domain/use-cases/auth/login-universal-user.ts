import { LoginUserDto } from "../../dtos/auth";
import { CustomError } from "../../errors";
import { UserRepository, JwtRepository } from "../../repositories";
import { LoginUser } from "./login-user";

export class LoginUniversalUser {
    constructor(
        private readonly userRepository: UserRepository,
        private readonly jwtRepository: JwtRepository
    ) {}

    async execute(loginUserDto: LoginUserDto, clientType: string) {
        if (clientType !== 'web' && clientType !== 'mobile') {
        throw CustomError.badRequest('Invalid client type. Must be "web" or "mobile".');
        }

        const { user, accessToken, refreshToken } = await new LoginUser(
            this.userRepository,
            this.jwtRepository
        ).execute(loginUserDto);

        // Decide el formato de respuesta según el tipo de cliente
        if (clientType === 'web') {
            return { user, accessToken, refreshToken, setCookies: true };
        } else {
            return { user, accessToken, refreshToken, setCookies: false };
        }
    }
}