import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as Joi from 'joi';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GeminiModule } from './modules/gemini/gemini.module';
import { Workflow } from './modules/workflow/entities/workflow.entity';
import { WorkflowModule } from './modules/workflow/workflow.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        NODE_ENV: Joi.string().valid('development', 'production'),
        PORT: Joi.number().default(3000),

        GEMINI_API_KEY: Joi.string().required(),

        DATABASE_URL: Joi.string().when('NODE_ENV', {
          is: 'production',
          then: Joi.required(),
          otherwise: Joi.optional(),
        }),
        REDIS_URL: Joi.string().when('NODE_ENV', {
          is: 'production',
          then: Joi.required(),
          otherwise: Joi.optional(),
        }),

        DB_HOST: Joi.string().when('NODE_ENV', {
          not: 'production',
          then: Joi.required(),
          otherwise: Joi.optional(),
        }),
        DB_PORT: Joi.number().when('NODE_ENV', {
          not: 'production',
          then: Joi.required(),
          otherwise: Joi.optional(),
        }),
        DB_USER: Joi.string().when('NODE_ENV', {
          not: 'production',
          then: Joi.required(),
          otherwise: Joi.optional(),
        }),
        DB_PASSWORD: Joi.string().when('NODE_ENV', {
          not: 'production',
          then: Joi.required(),
          otherwise: Joi.optional(),
        }),
        DB_NAME: Joi.string().when('NODE_ENV', {
          not: 'production',
          then: Joi.required(),
          otherwise: Joi.optional(),
        }),
        REDIS_HOST: Joi.string().when('NODE_ENV', {
          not: 'production',
          then: Joi.required(),
          otherwise: Joi.optional(),
        }),
        REDIS_PORT: Joi.number().when('NODE_ENV', {
          not: 'production',
          then: Joi.required(),
          otherwise: Joi.optional(),
        }),
      }),
    }),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const isProduction =
          configService.get<string>('NODE_ENV') === 'production';

        if (isProduction) {
          return {
            type: 'postgres',
            url: configService.get<string>('DATABASE_URL'),
            entities: [Workflow],
            synchronize: false,
            ssl: { rejectUnauthorized: false },
          };
        }

        return {
          type: 'postgres',
          host: configService.get<string>('DB_HOST') || 'localhost',
          port: parseInt(configService.get<string>('DB_PORT') || '5432'),
          username: configService.get<string>('DB_USER') || 'postgres',
          password: configService.get<string>('DB_PASSWORD') || 'password',
          database: configService.get<string>('DB_NAME') || 'workflow_db',
          entities: [Workflow],
          synchronize: true,
          ssl: false,
        };
      },
    }),

    BullModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const isProduction =
          configService.get<string>('NODE_ENV') === 'production';

        const connectionSettings = {
          retryStrategy: (times: number) => {
            return Math.min(times * 50, 3000);
          },
        };

        if (isProduction) {
          return {
            connection: {
              url: configService.get<string>('REDIS_URL'),
              tls: { rejectUnauthorized: false },
              ...connectionSettings,
            },
          };
        }

        return {
          connection: {
            host: configService.get<string>('REDIS_HOST') || 'localhost',
            port: parseInt(configService.get<string>('REDIS_PORT') || '6379'),
            ...connectionSettings,
          },
        };
      },
    }),

    GeminiModule,
    WorkflowModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
