import NotFoundError from "@/errors/not-found-error";
import { RolePermission } from "@/models/RolePermission";
import { RolePermissionSchemaType } from "@/schemas/role-permission";
import { IdSchemaType } from "@/schemas/shared/id";

const partialUpdate = async (
  id: IdSchemaType,
  data: RolePermissionSchemaType
) => {
  const { permission, role } = data;
  const rolePermission = await RolePermission.findById(id);

  if (!rolePermission) throw new NotFoundError();

  rolePermission?.set({ permission, role });
  await rolePermission?.save();

  return rolePermission?.toObject();
};

export default partialUpdate;
