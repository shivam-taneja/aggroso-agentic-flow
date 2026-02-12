import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Job } from 'bullmq';
import { Repository } from 'typeorm';
import { GeminiService } from '../gemini/gemini.service';
import { Workflow } from './entities/workflow.entity';
import { PROCESS_WORKFLOW_JOB, WORKFLOW_QUEUE } from './workflow.constants';

interface StepResult {
  step: string;
  output: string;
}

@Processor(WORKFLOW_QUEUE)
export class WorkflowProcessor extends WorkerHost {
  private readonly logger = new Logger(WorkflowProcessor.name);

  constructor(
    @InjectRepository(Workflow)
    private workflowRepo: Repository<Workflow>,
    private geminiService: GeminiService,
  ) {
    super();
  }

  async process(job: Job<{ workflowId: string }>) {
    if (job.name !== PROCESS_WORKFLOW_JOB) return;

    const { workflowId } = job.data;
    this.logger.log(`Starting Workflow: ${workflowId}`);

    const workflow = await this.workflowRepo.findOneBy({ id: workflowId });
    if (!workflow) return;

    workflow.status = 'IN_PROGRESS';
    await this.workflowRepo.save(workflow);

    let currentContext = workflow.originalInput;

    const resultsLog: StepResult[] = [];

    try {
      for (const [index, stepInstruction] of workflow.steps.entries()) {
        this.logger.log(
          `Step ${index + 1}/${workflow.steps.length}: ${stepInstruction}`,
        );

        const prompt = `
          CONTEXT: ${currentContext}
          INSTRUCTION: ${stepInstruction}
          OUTPUT: Return ONLY the result. No conversational filler.
        `;

        const output = await this.geminiService.generateText(prompt);

        resultsLog.push({ step: stepInstruction, output });

        workflow.results = [...resultsLog];
        await this.workflowRepo.save(workflow);

        currentContext = output;
      }

      workflow.status = 'COMPLETED';
      await this.workflowRepo.save(workflow);
      this.logger.log(`Workflow ${workflowId} Completed.`);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(`Workflow Failed: ${errorMessage}`);

      workflow.results = resultsLog;
      workflow.status = 'FAILED';
      workflow.error = errorMessage;
      await this.workflowRepo.save(workflow);
    }
  }
}
