import NotFoundError from "@/errors/not-found-error";
import User from "@/models/User";
import { IdSchemaType } from "@/schemas/shared/id";
import { UpdateUserSchemaType } from "@/schemas/user";

const partialUpdate = async (id: IdSchemaType, data: UpdateUserSchemaType) => {
  const { email, role, status, username } = data;

  const user = await User.findById(id).select("-password");
  if (!user) throw new NotFoundError();

  user?.set({ email, role, status, username });
  await user?.save();

  return user?.toObject();
};

export default partialUpdate;
