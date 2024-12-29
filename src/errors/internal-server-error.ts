import ApplicationError, { ErrorOptions } from "./application-error";

export default class InternalServerError extends ApplicationError {
  constructor(options: ErrorOptions = {}) {
    const { message, details, suggestion } = options;

    super({
      message: message || "Internal Server Error",
      statusCode: 500,
      code: "INTERNAL_SERVER_ERROR",
      details: details || "An unexpected error occurred on the server.",
      suggestion:
        suggestion ||
        "Please try again later or contact support if the issue persists.",
    });
  }
}
