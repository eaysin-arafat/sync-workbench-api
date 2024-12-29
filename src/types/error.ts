import { ZodIssue } from "zod";

export interface ErrorResponse {
  status?: string;
  statusCode: number;
  error: {
    code: string;
    message: string;
    details: string | ZodIssue[];
    requestId?: string;
    suggestion: string;
    documentation_url?: string;
    timestamp: string;
  };
}
