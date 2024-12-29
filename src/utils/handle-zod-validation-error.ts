import { Response } from "express";
import { ZodError } from "zod";
import { ErrorResponse } from "../types/error";

/**
 * Utility function to handle Zod validation errors and send a consistent response.
 * @param error - The ZodError object.
 * @param res - The Express response object.
 * @param validationType - The type of validation that failed (body, query, params).
 */
export const handleZodValidationError = (
  error: ZodError,
  res: Response,
  validationType: "body" | "query" | "params"
) => {
  const errorResponse: ErrorResponse = {
    status: "error",
    statusCode: 400,
    error: {
      code: "VALIDATION_ERROR",
      message: error.message,
      details: error.issues,
      suggestion: `Please check your ${validationType} data and try again.`,
      timestamp: new Date().toISOString(),
    },
  };

  res.status(400).json(errorResponse);
};
