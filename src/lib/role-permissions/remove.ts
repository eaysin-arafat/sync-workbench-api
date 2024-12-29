import NotFoundError from "@/errors/not-found-error";
import { RolePermission } from "@/models/RolePermission";
import { IdSchemaType } from "./../../schemas/shared/id";

const remove = async (id: IdSchemaType) => {
  const rolePermission = await RolePermission.findById(id);
  if (!rolePermission) throw new NotFoundError();

  return RolePermission.findByIdAndDelete(id);
};

export default remove;
