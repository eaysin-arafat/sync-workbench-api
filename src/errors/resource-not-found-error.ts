import ApplicationError, { ErrorOptions } from "./application-error";

export default class ResourceNotFoundError extends ApplicationError {
  constructor(
    resourceName: string,
    resourceId: string,
    options: ErrorOptions = {}
  ) {
    const { message, details, suggestion } = options;

    super({
      statusCode: 404,
      code: "RESOURCE_NOT_FOUND",
      message: message || `${resourceName} with ID ${resourceId} not found.`,
      details:
        details ||
        `The requested ${resourceName.toLowerCase()} with ID ${resourceId} was not found on this server.`,
      suggestion:
        suggestion ||
        `Please verify the ${resourceName.toLowerCase()} ID or check the resource status.`,
    });
  }
}
