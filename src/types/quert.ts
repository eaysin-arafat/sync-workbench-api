import { IdSchemaType } from "@/schemas/shared/id";
import { PopulateOptions } from "mongoose";

export type Populate = PopulateOptions | (string | PopulateOptions)[];

export interface IdWithPopulateType {
  id: IdSchemaType;
  populate?: Populate;
}
