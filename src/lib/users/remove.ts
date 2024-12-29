import NotFoundError from "@/errors/not-found-error";
import User from "@/models/User";
import { IdSchemaType } from "../../schemas/shared/id";

const remove = async (id: IdSchemaType) => {
  const user = await User.findById(id);
  if (!user) throw new NotFoundError();

  return User.findByIdAndDelete(id);
};

export default remove;
