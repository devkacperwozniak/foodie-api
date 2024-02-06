import { repl } from '@nestjs/core';
import { AppModule } from './app.module';

// DEVELOPMENT ONLY - in production, use migrations to do the migration
async function bootstrap() {
  await repl(AppModule);
}
bootstrap();
