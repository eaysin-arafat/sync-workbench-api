import BadRequest from "@/errors/bad-request-error";
import { LoginSchemaType } from "@/schemas/auth";
import { hashMatched } from "@/utils";
import { generateToken } from "../tokens";
import { findUserByUsername } from "../users";

const login = async (data: LoginSchemaType) => {
  const { username, password } = data;

  const user = await findUserByUsername(username);
  console.log({ user });
  if (!user) throw new BadRequest().toErrorResponse();

  const matched = await hashMatched(password, user.password);
  if (!matched) throw new BadRequest().toErrorResponse();

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
    payload: { id: user?.id },
  });

  return { accessToken, refreshToken };
};

export default login;
