import { ApiResponse, Workflow } from "@/types";
import { createMutation } from "react-query-kit";
import { api } from "../common";

interface CreateWorkflowParams {
  input: string;
  steps: string[];
}

export const useCreateWorkflow = createMutation<Workflow, CreateWorkflowParams>({
  mutationFn: async (variables) => {
    const { data } = await api.post<ApiResponse<Workflow>>('/workflows', variables);
    return data.data;
  },
});