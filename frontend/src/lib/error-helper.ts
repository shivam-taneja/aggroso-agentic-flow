import { ApiResponse } from '@/types';
import axios, { AxiosError } from 'axios';

export function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<ApiResponse<null>>;

    if (axiosError.response?.data?.message) {
      return axiosError.response.data.message;
    }

    return axiosError.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  if (typeof error === 'string') {
    return error;
  }

  return "Something went wrong";
}