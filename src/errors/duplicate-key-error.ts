import ApplicationError, { ErrorOptions } from "./application-error";

export default class DuplicateKeyError extends ApplicationError {
  constructor(
    resourceName: string,
    keyName: string,
    options: ErrorOptions = {}
  ) {
    const { message, details, suggestion } = options;

    super({
      statusCode: 409,
      code: "DUPLICATE_KEY_ERROR",
      message:
        message || `${resourceName} with the same ${keyName} already exists.`,
      details:
        details ||
        `A ${resourceName.toLowerCase()} with the specified ${keyName.toLowerCase()} already exists.`,
      suggestion:
        suggestion ||
        `Please ensure the ${keyName.toLowerCase()} is unique before trying again.`,
    });
  }
}
