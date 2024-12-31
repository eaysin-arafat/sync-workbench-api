import { env } from "@/env";
import { handleZodValidationError } from "@/utils/handle-zod-validation-error";
import { NextFunction, Request, RequestHandler, Response } from "express";
import { ZodError, ZodSchema } from "zod";
import logger from "../logger";

interface HandlerOptions {
  validation?: {
    body?: ZodSchema;
    query?: ZodSchema;
    params?: ZodSchema;
  };
}

export const requestMiddleware =
  <P = {}, ResBody = any, ReqBody = any, ReqQuery = any>(
    handler: (
      req: Request<P, ResBody, ReqBody, ReqQuery>,
      res: Response,
      next: NextFunction
    ) => Promise<void> | void,
    options?: HandlerOptions
  ): RequestHandler<P, ResBody, ReqBody, ReqQuery> =>
  async (req: Request<P, ResBody, ReqBody, ReqQuery>, res, next) => {
    // Validate body if schema is provided
    if (options?.validation?.body) {
      try {
        options.validation.body.parse(req.body);
      } catch (error) {
        if (error instanceof ZodError) {
          return handleZodValidationError(error, res, "body");
        }
        next(error);
      }
    }

    // Validate query if schema is provided
    if (options?.validation?.query) {
      try {
        options.validation.query.parse(req.query);
      } catch (error) {
        if (error instanceof ZodError) {
          return handleZodValidationError(error, res, "query");
        }
        next(error);
      }
    }

    // Validate params if schema is provided
    if (options?.validation?.params) {
      try {
        options.validation.params.parse(req.params);
      } catch (error) {
        if (error instanceof ZodError) {
          return handleZodValidationError(error, res, "params");
        }
        next(error);
      }
    }

    try {
      await handler(req, res, next);
    } catch (err) {
      if (env.NODE_ENV === "development") {
        logger.log({
          level: "error",
          message: "Error in request handler",
          error: err,
        });
      }
      next(err);
    }
  };
