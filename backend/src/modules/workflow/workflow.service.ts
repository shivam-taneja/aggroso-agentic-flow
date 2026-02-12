import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GeminiService } from '../gemini/gemini.service';
import { CreateWorkflowDto } from './dto/create-workflow.dto';
import { Workflow } from './entities/workflow.entity';

interface StepResult {
  step: string;
  output: string;
}

@Injectable()
export class WorkflowService {
  private readonly logger = new Logger(WorkflowService.name);

  constructor(
    @InjectRepository(Workflow)
    private workflowRepo: Repository<Workflow>,
    private geminiService: GeminiService,
  ) {}

  async createAndRun(dto: CreateWorkflowDto) {
    const workflow = this.workflowRepo.create({
      originalInput: dto.input,
      steps: dto.steps,
      status: 'PENDING',
      results: [],
    });

    const savedWorkflow = await this.workflowRepo.save(workflow);

    await this.processWorkflow(savedWorkflow);

    return this.workflowRepo.findOneBy({ id: savedWorkflow.id });
  }

  private async processWorkflow(workflow: Workflow) {
    let currentContext = workflow.originalInput;

    const resultsLog: StepResult[] = [];

    try {
      this.logger.log(`Starting Workflow ${workflow.id}`);

      for (const [index, stepInstruction] of workflow.steps.entries()) {
        this.logger.log(`Processing Step ${index + 1}: ${stepInstruction}`);

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
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error occurred';

      this.logger.error(`Workflow Failed: ${errorMessage}`);

      workflow.results = resultsLog;
      workflow.status = 'FAILED';
      workflow.error = errorMessage;

      await this.workflowRepo.save(workflow);
    }
  }

  async findAll() {
    return this.workflowRepo.find({
      order: { createdAt: 'DESC' },
      take: 10,
    });
  }

  async findOne(id: string) {
    return this.workflowRepo.findOneByOrFail({ id });
  }
}
