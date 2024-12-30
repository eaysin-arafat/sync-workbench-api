import AuthenticationError from "@/errors/authentication-error";
import { generateToken, verifyToken } from "../tokens";
import { findUserById } from "../users";

const refreshToken = async (refreshToken: string) => {
  const payload = verifyToken({ type: "RefreshToken", token: refreshToken });

  if (!payload || !payload.id) throw new AuthenticationError();

  const user = await findUserById(payload.id);
  if (!user) throw new AuthenticationError();

  const { id, email, username, status, role } = user;

  const newAccessToken = generateToken({
    type: "AccessToken",
    payload: { email, id, role, status, username },
  });

  return { accessToken: newAccessToken, refreshToken };
};

export default refreshToken;
