import NotFoundError from "@/errors/not-found-error";
import User from "@/models/User";
import { IdWithPopulateType } from "@/types/quert";

const getById = async ({ id, populate }: IdWithPopulateType) => {
  const userQuery = User.findById(id).select("-password");

  if (populate) userQuery.populate(populate);

  const user = await userQuery;
  if (!user) throw new NotFoundError();

  return { user: user.toObject() };
};

export default getById;
