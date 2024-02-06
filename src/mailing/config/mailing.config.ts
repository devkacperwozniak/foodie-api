import { registerAs } from '@nestjs/config';

export default registerAs('mailer', () => ({
  host: process.env.MAIL_HOST,
  username: process.env.SMTP_USERNAME,
  password: process.env.SMTP_PASSWORD,
  frontendURL: process.env.FRONTEND_URL,
  jwt: {
    secret: process.env.JWT_VERIFICATION_EMAIL_TOKEN_SECRET,
    expiresIn: parseInt(
      process.env.JWT_VERIFICATION_EMAIL_TOKEN_EXPIRATION_TTL,
      10,
    ),
  },
}));
