import ApplicationError, { ErrorOptions } from "./application-error";

export default class ConflictError extends ApplicationError {
  constructor(
    resourceName: string,
    resourceValue: string,
    options: ErrorOptions = {}
  ) {
    const { message, details, suggestion } = options;

    super({
      code: "RESOURCE_CONFLICT",
      message: message || `${resourceValue} already exists.`,
      details:
        details ||
        `A resource with the specified ${resourceValue.toLowerCase()} already exists in the system.`,
      suggestion:
        suggestion ||
        `Please use a unique ${resourceName.toLowerCase()} or check the resource for correctness.`,
      statusCode: 409,
    });
  }
}
