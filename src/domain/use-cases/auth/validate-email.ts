import { jwtAdapter } from "../../../configuration/plugins";
import { CustomError } from "../../errors";
import { UserRepository } from "../../repositories";

interface ValidateEmailUseCase {
  execute(token: string): Promise<object>;
}

export class ValidateEmail implements ValidateEmailUseCase {

  constructor(
    private readonly userRepository: UserRepository
  ){}

    async execute(token: string): Promise<object> {
    const payload = await jwtAdapter.validateToken(token);
    if(!payload) throw CustomError.unAuthorized('Invalid token');

    const { email } = payload as { email: string };
    if(!email) throw CustomError.internalServer('Email not existe in token');

    const user = await this.userRepository.getUserByEmail(email);
    if(!user) throw CustomError.internalServer('Email not existe in database');

    const updatedUser = await this.userRepository.updateEmailValidation(email, true);
    if(!updatedUser.emailVerified) throw CustomError.internalServer('Error updating email validation');

    return { 
      message: 'Email validated',
    };
  }
}