import BadRequest from "@/errors/bad-request-error";
import { PopulateOptions } from "mongoose";

type PopulateInput = string | string[] | undefined;
type PopulateOutput =
  | PopulateOptions
  | (string | PopulateOptions)[]
  | undefined;

/**
 * Validates and transforms the `populate` input into the expected type.
 *
 * @param populate - The input populate value (string, array, or undefined).
 * @returns The transformed populate value or undefined if invalid.
 * @throws ApplicationError if the populate value is invalid.
 */
export const parsePopulate = (populate: PopulateInput): PopulateOutput => {
  if (typeof populate === "string") {
    return populate.split(",").map((item) => item.trim());
  }

  if (Array.isArray(populate)) {
    return populate
      .filter((item): item is string => typeof item === "string")
      .map((item) => item.trim());
  }

  if (populate && typeof populate !== "string" && !Array.isArray(populate)) {
    throw new BadRequest({
      message:
        "Invalid populate format. Populate must be a string, an array, or undefined.",
    });
  }

  return undefined;
};
