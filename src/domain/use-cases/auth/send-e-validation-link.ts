import { jwtAdapter } from "../../../configuration/plugins";
import { EmailService } from "../../../presentation/email/email-service";
import { CustomError } from "../../errors";

interface SendEmailValidationLinkUseCase {
  execute(email: string): Promise<boolean>;
}

export class SendEmailValidationLink implements SendEmailValidationLinkUseCase {
  constructor(
    readonly emailService: EmailService,
    readonly WEB_SERVICE_URL: string
  ) {}

  async execute(email: string): Promise<boolean> {
    const token = await jwtAdapter.generateToken({ email });
    if(!token) throw CustomError.internalServer('Error generating token');

    const link = `${this.WEB_SERVICE_URL}/auth/validate-email/${token}`;

    const html = `
    <h1>Validate your email</h1>
    <p>Click the following link to validate your email</p>
    <a href="${link}">Validate email:${email}</a>
    `;

    const options = {//preparamos todo para enviar el email
      to: email, //para el email
      subject: 'This is the subject from the email', //el asunto del email
      htmlBody: html //el cuerpo del email
    }

    const isSent = await this.emailService.sendEmail(options); // Envio un url con token utilizando nodemailer
    if(!isSent) throw CustomError.internalServer('Error sending email');

    return true;
  }
}