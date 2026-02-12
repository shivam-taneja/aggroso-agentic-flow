export type ApiResponse<T> = {
  code: number;
  message: string;
  data: T;
  error: string | null;
  timestamp: string;
  path: string;
};

export type WorkflowStatus = 'PENDING' | 'COMPLETED' | 'FAILED'

export type StepResult = {
  step: string;
  output: string;
};

export type Workflow = {
  id: string;
  originalInput: string;
  steps: string[];
  results: StepResult[] | null;
  status: WorkflowStatus;
  error: string | null;
  createdAt: string;
};