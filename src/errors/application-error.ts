import { ErrorResponse } from "@/types/error";
import { formatValidationErrors } from "@/utils/formatted-message";
import { ZodIssue } from "zod";

export interface ErrorOptions {
  code?: string;
  statusCode?: number;
  message?: string;
  details?: string | ZodIssue[];
  suggestion?: string;
}

export default class ApplicationError extends Error {
  public code: string;
  public message: string;
  public statusCode: number;
  public details: string | ZodIssue[];
  public suggestion: string;
  public documentation_url: string = "https://api.example.com/docs/errors";

  constructor(options: ErrorOptions = {}) {
    const { code, message, statusCode, details, suggestion } = options;

    super(message || "An error occurred.");

    this.code = code || "INTERNAL_SERVER_ERROR";
    this.message = message || "An error occurred.";
    this.statusCode = statusCode || 500;
    this.details = details || [];
    this.suggestion = suggestion || "Please try again later.";
  }

  toErrorResponse(
    requestId?: string,
    documentationUrl?: string
  ): ErrorResponse {
    const formattedMessage = Array.isArray(this.details)
      ? formatValidationErrors(this.details)
      : this.details;

    return {
      status: "error",
      statusCode: this.statusCode,
      error: {
        code: this.code,
        message: this.message,
        details: formattedMessage,
        suggestion: this.suggestion,
        requestId: requestId || undefined,
        documentation_url: documentationUrl || this.documentation_url,
        timestamp: new Date().toISOString(),
      },
    };
  }
}
