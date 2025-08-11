import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { HttpConfigType } from './config/http.config';
import { Logger } from '@nestjs/common';
async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const httpConfig = configService.getOrThrow<HttpConfigType>('http');
  await app.listen(httpConfig.port).then(() => {
    logger.log(`Server is running on port: ${httpConfig.port}`);
  });
}
bootstrap();
