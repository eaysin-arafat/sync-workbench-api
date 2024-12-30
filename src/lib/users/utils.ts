import ConflictError from "@/errors/conflict-error";
import InternalServerError from "@/errors/internal-server-error";
import User from "@/models/User";
import { UserSchemaType } from "@/schemas/user";
import { Populate } from "@/types/quert";
import {
  createEmptyEmployeeForUser,
  removeEmployeeByUserId,
} from "../employees";

const findUserByUsername = async (username: string, populate?: Populate) => {
  const query = User.findOne({ username });
  if (populate) query.populate(populate);

  const user = await query;
  console.log(user, "==============");

  return user ? user : false;
};

const findUserById = async (id: string) => {
  const user = await User.findById({ _id: id });

  return user ? user : false;
};

const userExist = async (username: string) => {
  const user = await findUserByUsername(username);
  return user ? true : false;
};

const createUser = async (data: UserSchemaType) => {
  const { email, password, role, username, status } = data;

  const existingEmailUser = await User.findOne({ email });
  if (existingEmailUser) throw new ConflictError("user", `email: ${email}`);

  const existingUsernameUser = await User.findOne({ username });
  if (existingUsernameUser)
    throw new ConflictError("user", `username: ${username}`);

  try {
    const user = new User({ email, username, password, role, status });
    await user.save();
    return user.toObject();
  } catch (error) {
    try {
      const user = new User({ email, username, password, role, status });
      await user.save();
      return user.toObject();
    } catch (error) {
      throw new InternalServerError({
        message: "Database error occurred",
        statusCode: 500,
        code: "ERROR",
      });
    }
  }
};

const createUserWithEmployee = async (data: UserSchemaType) => {
  const { email, password, role, status, username } = data;
  const user = new User({ email, username, password, role, status });

  try {
    await user.save();

    const userId = user._id;
    if (!userId)
      throw new InternalServerError({
        message: "User ID not found after user creation",
        statusCode: 500,
        code: "ERROR",
      });

    const { employee: newEmployee } = await createEmptyEmployeeForUser(user.id);
    user.employee = newEmployee.id;
    await user.save();

    return { user: user.toObject(), employee: newEmployee.toObject() };
  } catch (error) {
    console.log("Error during user/employee creation, cleaning up...");

    const userId = user.id;
    if (userId) {
      await User.deleteOne({ _id: userId });
      await removeEmployeeByUserId(userId);
    }

    console.log(error);
    throw new InternalServerError({
      message: "Failed to create user and employee",
      statusCode: 500,
      code: "ERROR",
    });
  }
};

export {
  createUser,
  createUserWithEmployee,
  findUserById,
  findUserByUsername,
  userExist,
};
