import ApplicationError, { ErrorOptions } from "./application-error";

export default class UnprocessableEntityError extends ApplicationError {
  constructor(options: ErrorOptions = {}) {
    const { message, details, suggestion } = options;

    super({
      message: message || "Unprocessable Entity",
      statusCode: 422,
      code: "UNPROCESSABLE_ENTITY",
      details:
        details || "The request could not be processed due to semantic errors.",
      suggestion: suggestion || "Please verify the input data and try again.",
    });
  }
}
