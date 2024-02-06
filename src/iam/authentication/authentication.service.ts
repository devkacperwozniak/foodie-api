import {
  ConflictException,
  Inject,
  Injectable,
  UnauthorizedException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { User } from '../../users/entities/user.entity';
import { HashingService } from '../hashing/hashing.service';
import { SignUpDto } from './dto/sign-up.dto';
import { SignInDto } from './dto/sign-in.dto';
import { randomUUID } from 'crypto';
import { UsersService } from '../../users/users.service';
import { JwtService } from '@nestjs/jwt';
import jwtConfig from '../config/jwt.config';
import { ConfigType } from '@nestjs/config';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { RefreshTokenIdsStorage } from './refresh-token-ids.storage/refresh-token-ids.storage';
import { InvalidatedRefreshTokenError } from './refresh-token-ids.storage/Error/InvalidateRefreshTokenError';
import { ActiveUserData } from './interfaces/active-user-data.interface';
import { RefreshTokenPayload } from './interfaces/refresh-token-payload.interface';
import { MailingService } from '../../mailing/mailing.service';
import { EmailConfirmationService } from '../../mailing/email-confirmation/email-confirmation.service';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { PaymentsService } from 'src/payments/payments.service';

@Injectable()
export class AuthenticationService {
  constructor(
    private readonly userService: UsersService,
    private readonly hashingService: HashingService,
    private readonly jwtService: JwtService,
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
    private readonly refreshTokenIdsStorage: RefreshTokenIdsStorage,
    private readonly mailingService: MailingService,
    private readonly emailConfirmationService: EmailConfirmationService,
    private readonly paymentsService: PaymentsService,
  ) {}

  async signUp(signUpDto: SignUpDto) {
    try {
      const user = new User();
      user.username = signUpDto.username;
      user.email = signUpDto.email;
      user.password = await this.hashingService.hash(signUpDto.password);

      await this.userService.create(user);
      await this.mailingService.sendMailWelcomeEmailConfirmation(
        user.username,
        user.email,
      );
      await this.paymentsService.createCustomer(signUpDto);
    } catch (err) {
      const pgUniqueViolationErrorCode = '23505';
      if (err.code === pgUniqueViolationErrorCode) {
        throw new ConflictException();
      }
      throw err;
    }
  }

  async signIn(signInDto: SignInDto) {
    const user = await this.userService.findOneByEmail(signInDto.email);
    if (!user) {
      throw new UnauthorizedException(`User does not exists`);
    }
    const isEqual = await this.hashingService.compare(
      signInDto.password,
      user.password,
    );
    if (!isEqual) {
      throw new UnauthorizedException('Password does not match');
    }

    if (!user.isEmailConfirmed) {
      throw new ForbiddenException(`Confirm your email first`);
    }

    const tokens = await this.generateTokens(user);

    const role = { role: user.role };
    return { ...tokens, ...role };
  }

  async logout(id: number) {
    await this.refreshTokenIdsStorage.invalidate(id);
  }

  private async generateTokens(user: User) {
    const refreshTokenId = randomUUID();
    const [accessToken, refreshToken] = await Promise.all([
      this.signToken<Partial<ActiveUserData>>(
        user.id,
        this.jwtConfiguration.accessTokenTtl,
        {
          email: user.email,
          role: user.role,
        },
      ),
      this.signToken<Partial<RefreshTokenPayload>>(
        user.id,
        this.jwtConfiguration.refreshTokenTtl,
        {
          refreshTokenId,
        },
      ),
    ]);
    await this.refreshTokenIdsStorage.insert(user.id, refreshTokenId);
    const currTime = Date.now();
    return {
      accessToken,
      refreshToken,
      expiresIn: currTime + this.jwtConfiguration.accessTokenTtl,
    };
  }

  async refreshTokens(refreshTokenDto: RefreshTokenDto) {
    try {
      const { sub, refreshTokenId } = await this.jwtService.verifyAsync(
        refreshTokenDto.refreshToken,
        {
          secret: this.jwtConfiguration.secret,
          audience: this.jwtConfiguration.audience,
          issuer: this.jwtConfiguration.issuer,
        },
      );
      const user = await this.userService.findOne(sub);
      const isValid = await this.refreshTokenIdsStorage.validate(
        user.id,
        refreshTokenId,
      );
      if (isValid) {
        await this.refreshTokenIdsStorage.invalidate(user.id);
      } else {
        throw new Error('Refresh token is invalid');
      }
      return this.generateTokens(user);
    } catch (err) {
      if (err instanceof InvalidatedRefreshTokenError) {
        throw new UnauthorizedException('Access denied');
      }
      throw new UnauthorizedException();
    }
  }

  async resetPassword(resetPasswordData: ResetPasswordDto) {
    const email = await this.emailConfirmationService.decodeConfirmationToken(
      resetPasswordData.token,
    );
    const user = await this.userService.findOneByEmail(email);
    if (!user) {
      throw new BadRequestException(`User ${email} does not exist`);
    }
    const hashPassword = await this.hashingService.hash(
      resetPasswordData.password,
    );
    await this.userService.resetPassword(email, hashPassword);
  }

  private async signToken<T>(userId: number, expiresIn: number, payload?: T) {
    const accessToken = await this.jwtService.signAsync(
      {
        sub: userId,
        ...payload,
      },
      {
        audience: this.jwtConfiguration.audience,
        issuer: this.jwtConfiguration.issuer,
        secret: this.jwtConfiguration.secret,
        expiresIn,
      },
    );
    return accessToken;
  }
}
