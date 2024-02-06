import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ConfirmEmailDto } from './dto/confirmEmail.dto';
import { EmailConfirmationService } from './email-confirmation.service';
import { ResendConfirmationDto } from './dto/resendConfirmation.dto';
import { Auth } from '../../iam/authentication/decorators/auth.decorator';
import { AuthType } from '../../iam/authentication/enums/auth-type.enum';

@Auth(AuthType.None)
@Controller('email-confirmation')
export class EmailConfirmationController {
  constructor(
    private readonly emailConfirmationService: EmailConfirmationService,
  ) {}

  @HttpCode(HttpStatus.OK)
  @Post('confirm')
  async confirm(@Body() confirmationData: ConfirmEmailDto) {
    const email = await this.emailConfirmationService.decodeConfirmationToken(
      confirmationData.token,
    );
    await this.emailConfirmationService.confirmEmail(email);
  }

  @HttpCode(HttpStatus.OK)
  @Post('resend-confirmation-link')
  async resendConfirmationLink(@Body() emailData: ResendConfirmationDto) {
    await this.emailConfirmationService.resendConfirmationLink(emailData.email);
  }
}
