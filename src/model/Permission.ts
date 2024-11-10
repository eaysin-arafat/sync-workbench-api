import { Document, Schema, model } from "mongoose";

export interface IPermission extends Document {
  resource: string;
  action: string;
  description?: string;
}

const permissionSchema = new Schema<IPermission>(
  {
    resource: { type: String, required: true },
    action: {
      type: String,
      required: true,
      enum: ["read", "create", "update", "delete"],
    },
    description: { type: String },
  },
  { timestamps: true }
);

export const Permission = model<IPermission>("Permission", permissionSchema);
