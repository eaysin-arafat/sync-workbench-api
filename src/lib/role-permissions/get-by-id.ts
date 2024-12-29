import NotFoundError from "@/errors/not-found-error";
import { RolePermission } from "@/models/RolePermission";
import { IdWithPopulateType } from "@/types/quert";

const getById = async ({ id, populate }: IdWithPopulateType) => {
  const query = RolePermission.findById(id);
  if (populate) query.populate(populate);

  const rolePermission = await query;
  if (!rolePermission) throw new NotFoundError();

  return { rolePermission: rolePermission.toObject() };
};

export default getById;
