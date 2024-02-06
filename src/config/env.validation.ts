import { plainToInstance } from 'class-transformer';
import { IsNumber, IsString, MinLength, validateSync } from 'class-validator';

class EnvironmentVariables {
  // APP PORT
  @IsNumber()
  PORT: number;

  // DB
  @IsString()
  @MinLength(1)
  DATABASE_USER: string;

  @IsString()
  @MinLength(1)
  DATABASE_PASSWORD: string;

  @IsString()
  @MinLength(1)
  DATABASE_NAME: string;

  @IsNumber()
  DATABASE_PORT: number;

  @IsString()
  @MinLength(3)
  DATABASE_HOST: string;

  // JWT
  @IsString()
  @MinLength(10)
  JWT_SECRET: string;

  @IsString()
  @MinLength(3)
  JWT_TOKEN_AUDIENCE: string;

  @IsString()
  @MinLength(3)
  JWT_TOKEN_ISSUER: string;

  @IsNumber()
  JWT_ACCESS_TOKEN_TTL: number;

  @IsNumber()
  JWT_REFRESH_TOKEN_TTL: number;

  // REDIS
  @IsString()
  @MinLength(3)
  REDIS_HOST: string;

  @IsNumber()
  REDIS_PORT: number;

  @IsString()
  @MinLength(3)
  REDIS_PASSWORD: string;

  // MAILER
  @IsString()
  @MinLength(3)
  MAIL_HOST: string;

  @IsString()
  @MinLength(3)
  SMTP_USERNAME: string;

  @IsString()
  @MinLength(3)
  SMTP_PASSWORD: string;

  // MAILE/JWT
  @IsString()
  @MinLength(3)
  JWT_VERIFICATION_EMAIL_TOKEN_SECRET: string;

  @IsNumber()
  JWT_VERIFICATION_EMAIL_TOKEN_EXPIRATION_TTL: number;
}

export function validate(config: Record<string, unknown>) {
  const validatedConfig = plainToInstance(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });
  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    throw new Error(errors.toString());
  }
  return validatedConfig;
}
