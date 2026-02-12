import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

export type WorkflowStatus = 'PENDING' | 'COMPLETED' | 'FAILED';

export interface StepResult {
  step: string;
  output: string;
}

@Entity()
export class Workflow {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text')
  originalInput: string;

  // Stores the list of instructions (e.g., ["Summarize", "Translate"])
  @Column('jsonb')
  steps: string[];

  // Stores the results (e.g., [{ step: "Summarize", output: "..." }])
  @Column('jsonb', { nullable: true })
  results: StepResult[];

  @Column({ default: 'PENDING' })
  status: WorkflowStatus;

  @Column({ type: 'text', nullable: true })
  error: string; // To store error message if it fails

  @CreateDateColumn()
  createdAt: Date;
}
