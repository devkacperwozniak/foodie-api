import { Module } from '@nestjs/common';
import { MailingController } from './mailing.controller';
import { MailingService } from './mailing.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigModule, ConfigType } from '@nestjs/config';
import { join } from 'path';
import { EjsAdapter } from '@nestjs-modules/mailer/dist/adapters/ejs.adapter';
import { EmailConfirmationService } from './email-confirmation/email-confirmation.service';
import { EmailConfirmationController } from './email-confirmation/email-confirmation.controller';
import mailingConfig from './config/mailing.config';
import { UsersModule } from '../users/users.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    UsersModule,
    ConfigModule.forFeature(mailingConfig),
    JwtModule,
    MailerModule.forRootAsync({
      imports: [ConfigModule.forFeature(mailingConfig)],
      inject: [mailingConfig.KEY],
      useFactory: async (config: ConfigType<typeof mailingConfig>) => ({
        transport: {
          host: config.host,
          secure: false,
          auth: {
            user: config.username,
            pass: config.password,
          },
        },
        defaults: {
          from: `"Foodie" <${config.username}>`,
        },
        template: {
          dir: join(__dirname, 'templates'),
          adapter: new EjsAdapter(),
          options: {
            strict: false,
          },
        },
      }),
    }),
  ],
  controllers: [MailingController, EmailConfirmationController],
  providers: [MailingService, EmailConfirmationService],
  exports: [MailingService, EmailConfirmationService],
})
export class MailingModule {}
