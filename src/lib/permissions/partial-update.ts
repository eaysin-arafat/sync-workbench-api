import NotFoundError from "@/errors/not-found-error";
import { Permission } from "@/models/Permission";
import { PermissionSchemaType } from "@/schemas/permission";
import { IdSchemaType } from "@/schemas/shared/id";

const partialUpdate = async (
  id: IdSchemaType,
  payload: PermissionSchemaType
) => {
  const { action, resource, description } = payload;

  const permission = await Permission.findById(id);
  if (!permission) throw new NotFoundError();

  permission?.set({ action, resource, description });
  await permission?.save();

  return permission?.toObject();
};

export default partialUpdate;
