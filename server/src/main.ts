import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { HttpConfigType } from './config/http.config';
import { Logger, ValidationPipe } from '@nestjs/common';
import { CorsConfigType } from './config/cors.config';
import { NestExpressApplication } from '@nestjs/platform-express';
import helmet from 'helmet';
async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const configService = app.get(ConfigService);
  const httpConfig = configService.getOrThrow<HttpConfigType>('http');
  const corsConfig = configService.getOrThrow<CorsConfigType>('cors');
  app.enableCors({
    origin: corsConfig.origin,
    credentials: corsConfig.credentials,
    methods: 'GET,PUT,PATCH,POST,DELETE',
  });
  app.setGlobalPrefix('api');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );
  app.use(
    helmet({
      contentSecurityPolicy:
        process.env.NODE_ENV === 'production' ? undefined : false,
    }),
  );
  await app.listen(httpConfig.port).then(() => {
    logger.log(`Server is running on port: ${httpConfig.port}`);
  });
}
bootstrap();
