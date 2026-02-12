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
    if (job.name !== PROCESS_WORKFLOW_JOB) {
      this.logger.warn(`Unknown job name: ${job.name}`);
      return;
    }

    const { workflowId } = job.data;
    this.logger.log(`Starting processing for Workflow ID: ${workflowId}`);

    const workflow = await this.workflowRepo.findOneBy({ id: workflowId });

    if (!workflow) {
      this.logger.error(`Workflow not found: ${workflowId}`);
      return;
    }

    workflow.status = 'IN_PROGRESS';
    await this.workflowRepo.save(workflow);

    let currentContext = workflow.originalInput;
    const resultsLog: StepResult[] = [];

    try {
      for (const [index, stepInstruction] of workflow.steps.entries()) {
        this.logger.log(
          `Workflow ${workflowId}: Running Step ${index + 1} - ${stepInstruction}`,
        );

        const prompt = `
          You are a precise data processing assistant.
          
          --- INPUT DATA ---
          ${currentContext}
          ------------------

          --- INSTRUCTION ---
          ${stepInstruction}
          -------------------
          
          OUTPUT REQUIREMENT:
          Return ONLY the result of the instruction. 
          Do not include conversational filler like "Here is the summary:".
        `;

        const output = await this.geminiService.generateText(prompt);

        resultsLog.push({ step: stepInstruction, output });

        currentContext = output;
      }

      workflow.results = resultsLog;
      workflow.status = 'COMPLETED';
      await this.workflowRepo.save(workflow);
      this.logger.log(`Workflow ${workflowId} completed successfully.`);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error occurred';

      this.logger.error(`Workflow ${workflowId} Failed: ${errorMessage}`);

      workflow.results = resultsLog;
      workflow.status = 'FAILED';
      workflow.error = errorMessage;

      await this.workflowRepo.save(workflow);
    }
  }
}
