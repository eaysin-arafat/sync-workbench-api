import ApplicationError, { ErrorOptions } from "./application-error";

export default class BadRequest extends ApplicationError {
  constructor(options: ErrorOptions = {}) {
    const { message, details, suggestion } = options;

    super({
      message: message || "Bad Request",
      statusCode: 400,
      code: "BAD_REQUEST",
      details: details || [],
      suggestion:
        suggestion || "Please check the request parameters and try again.",
    });
  }
}
