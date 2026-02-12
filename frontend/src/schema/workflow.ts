import { z } from 'zod';

export const workflowSchema = z.object({
  input: z
    .string()
    .min(10, "Input text must be at least 10 characters")
    .max(1000, "Input text cannot exceed 1000 characters"),
  steps: z
    .array(
      z.object({
        value: z
          .string()
          .min(3, "Step instruction is too short")
          .max(300, "Step instruction cannot exceed 300 characters"),
      })
    )
    .min(1, "You must add at least one step")
    .max(20, "You can add at most 20 steps"),
});

export type WorkflowFormValues = z.infer<typeof workflowSchema>;