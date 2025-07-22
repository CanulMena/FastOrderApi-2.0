import { CustomError } from "../../errors";
import { JwtRepository } from "../../repositories";

interface LogoutUserUseCase {
    execute(refreshToken: string): Promise<object>;
}

export class LogoutUser implements LogoutUserUseCase {
    constructor(
        private readonly jwtRepository: JwtRepository,
    ) {}

    async execute(refreshToken: string): Promise<object> {
        if (!refreshToken || typeof refreshToken !== 'string' || refreshToken.trim() === '') {
            throw CustomError.badRequest('Invalid refresh token');
        }

        const tokenExists = await this.jwtRepository.findRefreshToken(refreshToken);
        if (!tokenExists) {
            throw CustomError.notFound('Refresh token not found');
        }

        await this.jwtRepository.deleteRefreshToken(refreshToken);
        return { message: 'Refresh token deleted successfully' };
    }
}