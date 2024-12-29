import NotFoundError from "@/errors/not-found-error";
import { Permission } from "@/models/Permission";
import { IdSchemaType } from "@/schemas/shared/id";

const getById = async (id: IdSchemaType) => {
  const permission = await Permission.findById(id);
  if (!permission) throw new NotFoundError();

  return { permission: permission.toObject() };
};

export default getById;
