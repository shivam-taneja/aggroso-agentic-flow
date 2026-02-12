import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Workflow } from './entities/workflow.entity';
import { WORKFLOW_QUEUE } from './workflow.constants'; // Import Constant
import { WorkflowController } from './workflow.controller';
import { WorkflowProcessor } from './workflow.processor';
import { WorkflowService } from './workflow.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Workflow]),

    BullModule.registerQueue({
      name: WORKFLOW_QUEUE,
    }),
  ],
  controllers: [WorkflowController],
  providers: [WorkflowService, WorkflowProcessor],
})
export class WorkflowModule {}
