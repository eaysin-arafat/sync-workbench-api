import ApplicationError, { ErrorOptions } from "./application-error";

export default class AuthorizationError extends ApplicationError {
  constructor(options: ErrorOptions = {}) {
    const { message, details, suggestion } = options;

    super({
      code: "PERMISSION_DENIED",
      details: details || "You do not have permission to access this resource.",
      message: message || "Authorization Error",
      suggestion:
        suggestion ||
        "Please check your permissions or contact the administrator.",
      statusCode: 403,
    });
  }
}
