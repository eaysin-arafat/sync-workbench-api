import { UserSchema, UserSchemaType } from "@/schemas";
import { validateSchemas } from "@/utils";
import { conflictError, generateErrorResponse } from "@/utils/errors";
import { generateHash } from "@/utils/hashing";
import { generateToken } from "../token";
import { createUser, userExist } from "../user";

const register = async (data: UserSchemaType) => {
  const payload = validateSchemas(data, UserSchema) as UserSchemaType;
  const { email, password, role, status, username } = payload;

  const hasUser = await userExist(username);
  if (hasUser)
    throw generateErrorResponse({
      ...conflictError("username", username),
    });

  const hashedPassword = await generateHash(password);
  const user = await createUser({
    email,
    password: hashedPassword,
    role,
    status,
    username,
  });

  const tokenPayload = {
    id: user.id,
    username: user.username,
    email: user.email,
    role: user.role,
    status: user.status,
  };

  const accessToken = generateToken({
    type: "AccessToken",
    payload: tokenPayload,
  });
  const refreshToken = generateToken({
    type: "RefreshToken",
    payload: tokenPayload,
  });

  return { accessToken, refreshToken };
};

export default register;
