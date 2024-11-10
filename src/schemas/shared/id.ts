import { z } from "zod";

export const idSchema = z
  .string()
  .min(1, "ID is required")
  .regex(/^[a-fA-F0-9]{24}$/, "Invalid id string");

export type IdSchemaType = z.infer<typeof idSchema>;