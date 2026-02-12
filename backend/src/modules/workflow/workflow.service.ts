import { InjectQueue } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Queue } from 'bullmq';
import { Repository } from 'typeorm';
import { CreateWorkflowDto } from './dto/create-workflow.dto';
import { Workflow } from './entities/workflow.entity';
import { PROCESS_WORKFLOW_JOB, WORKFLOW_QUEUE } from './workflow.constants';

@Injectable()
export class WorkflowService {
  constructor(
    @InjectRepository(Workflow)
    private workflowRepo: Repository<Workflow>,
    @InjectQueue(WORKFLOW_QUEUE) private workflowQueue: Queue,
  ) {}

  async createAndRun(dto: CreateWorkflowDto) {
    const workflow = this.workflowRepo.create({
      originalInput: dto.input,
      steps: dto.steps,
      status: 'PENDING',
      results: [],
    });

    const savedWorkflow = await this.workflowRepo.save(workflow);

    await this.workflowQueue.add(PROCESS_WORKFLOW_JOB, {
      workflowId: savedWorkflow.id,
    });

    return savedWorkflow;
  }

  async findAll(page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;

    return this.workflowRepo.find({
      order: { createdAt: 'DESC' },
      skip: skip,
      take: limit,
    });
  }

  async findOne(id: string) {
    return this.workflowRepo.findOneByOrFail({ id });
  }
}
