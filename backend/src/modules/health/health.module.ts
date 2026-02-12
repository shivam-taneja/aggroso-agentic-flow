import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WORKFLOW_QUEUE } from '../workflow/workflow.constants';
import { HealthController } from './health.controller';

@Module({
  imports: [
    TypeOrmModule,
    BullModule.registerQueue({
      name: WORKFLOW_QUEUE,
    }),
  ],
  controllers: [HealthController],
})
export class HealthModule {}
