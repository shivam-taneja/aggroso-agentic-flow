'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { useCreateWorkflow, useGetWorkflows } from '@/hooks/api/workflows';
import { getErrorMessage } from '@/lib/error-helper';
import { WorkflowFormValues, workflowSchema } from '@/schema/workflow';
import { Workflow } from '@/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQueryClient } from '@tanstack/react-query';
import { Loader2, Play, Plus, Trash2 } from 'lucide-react';
import { useFieldArray, useForm } from 'react-hook-form';
import { toast } from 'sonner';

interface WorkflowFormProps {
  onSuccess: (workflow: Workflow) => void;
}

export function WorkflowForm({ onSuccess }: WorkflowFormProps) {
  const queryClient = useQueryClient();

  const form = useForm<WorkflowFormValues>({
    resolver: zodResolver(workflowSchema),
    defaultValues: {
      input: '',
      steps: [{ value: '' }],
    },
    mode: 'onChange'
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'steps',
  });

  const { mutateAsync, isPending } = useCreateWorkflow({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: useGetWorkflows.getKey() });
    }
  });

  const onSubmit = (data: WorkflowFormValues) => {
    const flatSteps = data.steps.map((s) => s.value);

    const promise = mutateAsync({ input: data.input, steps: flatSteps });

    toast.promise(promise, {
      loading: 'Running workflow steps...',
      success: (data) => {
        onSuccess(data);
        return 'Workflow run completed successfully!';
      },
      error: (error) => getErrorMessage(error),
    });
  };

  return (
    <div className="max-w-2xl mx-auto py-10">
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-bold tracking-tight mb-2">Create Workflow</h2>
        <p className="text-muted-foreground">
          Chain multiple AI instructions together to process your text.
        </p>
      </div>

      <Card className="border-2 shadow-lg">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="p-6 space-y-8">
              <FormField
                control={form.control}
                name="input"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>1. Input Text</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Paste the text you want to process here..."
                        className="min-h-37.5 resize-none text-base"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Separator />

              <div className="space-y-4">
                <FormLabel>2. Define Steps</FormLabel>
                <div className="space-y-3">
                  {fields.map((field, index) => (
                    <FormField
                      key={field.id}
                      control={form.control}
                      name={`steps.${index}.value`}
                      render={({ field }) => (
                        <FormItem>
                          <div className="flex gap-2 items-center">
                            <div className="flex-none w-6 text-center text-sm font-bold text-muted-foreground">
                              {index + 1}
                            </div>
                            <FormControl>
                              <Input
                                placeholder={`e.g. "Summarize this in 3 sentences"`}
                                {...field}
                              />
                            </FormControl>
                            {fields.length > 1 && (
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={() => remove(index)}
                                className="text-muted-foreground hover:text-destructive"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                          <FormMessage className="pl-8" />
                        </FormItem>
                      )}
                    />
                  ))}
                </div>

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => append({ value: '' })}
                  className="ml-8"
                >
                  <Plus className="mr-2 h-3 w-3" /> Add Step
                </Button>
              </div>
            </CardContent>

            <CardFooter className="bg-muted/20 p-6 border-t">
              <Button
                type="submit"
                disabled={isPending}
                className="w-full h-12 text-lg"
                size="lg"
              >
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Processing...
                  </>
                ) : (
                  <>
                    <Play className="mr-2 h-5 w-5 fill-current" /> Run Workflow
                  </>
                )}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  );
}