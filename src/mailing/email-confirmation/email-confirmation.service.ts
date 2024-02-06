import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { UsersService } from '../../users/users.service';
import mailingConfig from '../config/mailing.config';
import { ConfigType } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { MailingService } from '../mailing.service';

@Injectable()
export class EmailConfirmationService {
  constructor(
    private readonly usersService: UsersService,
    @Inject(mailingConfig.KEY)
    private readonly mailingConfiguration: ConfigType<typeof mailingConfig>,
    private readonly jwtService: JwtService,
    private readonly mailingService: MailingService,
  ) {}
  async confirmEmail(email: string) {
    const user = await this.usersService.findOneByEmail(email);
    if (!user) {
      throw new BadRequestException(`User with email ${email} does not exist`);
    }
    if (user.isEmailConfirmed) {
      throw new BadRequestException('Email already confirmed');
    }
    await this.usersService.markEmailAsConfirmed(email);
  }
  async decodeConfirmationToken(token: string) {
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: this.mailingConfiguration.jwt.secret,
      });
      if (typeof payload === 'object' && 'email' in payload) {
        return payload.email;
      }
      throw new BadRequestException();
    } catch (error) {
      if (error?.name === 'TokenExpiredError') {
        throw new BadRequestException('Email confirmation token expired');
      }
      throw new BadRequestException('Bad confirmation token');
    }
  }
  async resendConfirmationLink(email: string) {
    await this.mailingService.reSendEmailConfirmation(email);
  }
}
