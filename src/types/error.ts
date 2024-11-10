import { ZodIssue } from "zod";

export interface ErrorDetails {
  code: string;
  message: string;
  details: string | ZodIssue[];
  suggestion: string;
}

export interface ErrorResponse {
  status?: string;
  statusCode: number;
  error: ErrorDetails;
  requestId?: string;
  documentation_url?: string;
  timestamp: string;
}