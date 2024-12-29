import NotFoundError from "@/errors/not-found-error";
import { Role } from "@/models/Role";
import { IdSchemaType } from "../../schemas/shared/id";

const remove = async (id: IdSchemaType) => {
  const role = await Role.findById(id);
  if (!role) throw new NotFoundError();

  return Role.findByIdAndDelete(id);
};

export default remove;
