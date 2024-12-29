import ApplicationError, { ErrorOptions } from "./application-error";

export default class AuthenticationError extends ApplicationError {
  constructor(options: ErrorOptions = {}) {
    const { message, details, suggestion } = options;

    super({
      code: "AUTHENTICATION_FAILED",
      details: details || "Authentication failed due to invalid credentials.",
      suggestion: suggestion || "Please verify your credentials and try again.",
      message: message || "Authentication Error",
      statusCode: 401,
    });
  }
}
