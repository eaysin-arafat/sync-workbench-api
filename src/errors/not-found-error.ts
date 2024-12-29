import ApplicationError, { ErrorOptions } from "./application-error";

export default class NotFoundError extends ApplicationError {
  constructor(options: ErrorOptions = {}) {
    const { message, details, suggestion } = options;

    super({
      message: message || "Resource Not Found",
      statusCode: 404,
      code: "NOT_FOUND",
      details:
        details || "The requested resource was not found on this server.",
      suggestion:
        suggestion || "Please check the URL or refer to the API documentation.",
    });
  }
}
