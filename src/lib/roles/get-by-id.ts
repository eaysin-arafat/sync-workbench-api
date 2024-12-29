import NotFoundError from "@/errors/not-found-error";
import { Role } from "@/models/Role";
import { IdSchemaType } from "@/schemas/shared/id";

const getById = async (id: IdSchemaType) => {
  const role = await Role.findById(id);
  if (!role) throw new NotFoundError();

  return { role: role.toObject() };
};

export default getById;
