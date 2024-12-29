import NotFoundError from "@/errors/not-found-error";
import { Role } from "@/models/Role";
import mongoose from "mongoose";

/**
 * Resolves a role name to its corresponding ObjectId.
 * @param roleName - The name of the role to resolve.
 * @returns {Promise<mongoose.Types.ObjectId | null>} The role ObjectId or null.
 */
export const resolveRoleId = async (
  roleName: string
): Promise<mongoose.Types.ObjectId | null> => {
  if (!roleName) return null;

  const roleDoc = await Role.findOne({
    name: { $regex: new RegExp(`^${roleName}$`, "i") },
  }).select("_id");

  if (!roleDoc) throw new NotFoundError();

  return roleDoc._id as mongoose.Types.ObjectId;
};
