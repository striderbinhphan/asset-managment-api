import {MiddlewareConsumer, Module, NestModule, RequestMethod} from '@nestjs/common';
import {PrismaModule} from './prisma/prisma.module';
import {ConfigModule} from '@nestjs/config';
import configuration from './common/configuration';
import {JwtModule} from '@nestjs/jwt';
import {PassportModule} from '@nestjs/passport';
import {CacheModule} from '@nestjs/cache-manager';
import {AppController} from './app.controller';
import {HealthModule} from './health/health.module';
import {LoggerModule} from './logger/logger.module';
import {ExternalModule} from './external/external.module';
import {SchedulerModule} from './scheduler/scheduler.module';
import {AssetModule} from './asset/asset.module';
import {OrganizationModule} from './organization/organization.module';

@Module({
  imports: [
    LoggerModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      load: [configuration],
    }),
    PassportModule,
    JwtModule.register({}),
    CacheModule.register({
      max: 10,
      isGlobal: true,
    }),
    PrismaModule,
    HealthModule,
    ExternalModule,
    SchedulerModule,
    AssetModule,
    OrganizationModule,
  ],
  controllers: [AppController],
})
export class AppModule {
  async onApplicationBootstrap() {
    const port = process.env.PORT || 8002;
    console.info(`Asset Management API started`);
    console.info(`Started on http://localhost:${port}`);
    console.info(`Docs available on http://localhost:${port}/docs`);
  }
}
