import NotFoundError from "@/errors/not-found-error";
import { Role } from "@/models/Role";
import { RoleSchemaType } from "@/schemas/role";
import { IdSchemaType } from "@/schemas/shared/id";

const partialUpdate = async (id: IdSchemaType, data: RoleSchemaType) => {
  const { name, description } = data;

  const role = await Role.findById(id);
  if (!role) throw new NotFoundError();

  role?.set({ name, description });
  await role?.save();

  return role?.toObject();
};

export default partialUpdate;
