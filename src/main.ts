import {NestFactory} from '@nestjs/core';
import {ValidationPipe} from '@nestjs/common';
import cookieParser from 'cookie-parser';
import {ConfigService} from '@nestjs/config';
import {CorsOptions} from '@nestjs/common/interfaces/external/cors-options.interface';
import {configKeys, DEFAULT_CORS_OPTIONS} from './common/constants';
import {SwaggerModule, DocumentBuilder} from '@nestjs/swagger';
import {text} from 'body-parser';
import {AppModule} from './app.module';
import {PrismaService} from './prisma/prisma.service';
import {NestExpressApplication} from '@nestjs/platform-express';
import {WinstonModule} from 'nest-winston';
import {loggerInstance} from './common/configs/winston.config';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    rawBody: true,
    logger: WinstonModule.createLogger({
      instance: loggerInstance,
    }),
  });
  app.setGlobalPrefix('api');
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );
  const corsOptions = DEFAULT_CORS_OPTIONS as CorsOptions;
  const configService = app.get(ConfigService);
  const whiteListDomains = configService.get(configKeys.corsCommaSeperatedDomainWhitelist);
  if (whiteListDomains) {
    corsOptions.origin = (whiteListDomains as string).split(',');
  }
  app.enableCors(corsOptions);
  app.get(PrismaService);
  app.use(cookieParser());
  app.useBodyParser('json', {limit: '10mb'});
  app.use(text());
  const config = new DocumentBuilder()
    .setTitle('PP Inventory Backend')
    .setDescription('Description')
    .setVersion('0.1')
    .addCookieAuth(process.env.COOKIE_ACCESS_TOKEN_KEY, {
      type: 'http',
      in: 'Header',
      scheme: 'Bearer',
    })
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  const port = process.env.PORT || 8002;
  await app.listen(port);
}
bootstrap().catch((err) => {
  console.error('PP Inventory Service failed to start', err);
});

process.on('uncaughtException', (err) => console.error('Uncaught Exception', err));
process.on('unhandledRejection', (err, promise) => {
  console.error(`Unhandled Rejection at: ${promise}, reason: ${err}`, err);
});
