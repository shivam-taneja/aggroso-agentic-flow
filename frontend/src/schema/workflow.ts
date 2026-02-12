import { z } from 'zod';

export const workflowSchema = z.object({
  input: z.string().min(10, "Input text must be at least 10 characters"),
  steps: z.array(
    z.object({
      value: z.string().min(3, "Step instruction is too short")
    })
  ).min(1, "You must add at least one step")
});

export type WorkflowFormValues = z.infer<typeof workflowSchema>;