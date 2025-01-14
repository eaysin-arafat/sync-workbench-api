import AuthenticationError from "@/errors/authentication-error";
import { generateToken, verifyToken } from "@/lib/tokens";
import {
  createUser,
  findUserByEmail,
  findUserById,
  updateUserToken,
} from "@/lib/users";
import RefreshTokenModel from "@/models/RefreshToken";
import bcrypt from "bcrypt";

class AuthenticateService {
  async login(email: string, password: string, createdByIp: string) {
    const user = await findUserByEmail(email);
    if (!user) throw new AuthenticationError("User not found");

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) throw new AuthenticationError("Invalid credentials");

    const accessToken = generateToken({
      type: "AccessToken",
      payload: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    });

    const refreshToken = generateToken({
      type: "RefreshToken",
      payload: { id: user.id },
    });

    const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
    await RefreshTokenModel.create({
      user: user.id,
      token: refreshToken,
      expires,
      createdByIp,
    });

    return { accessToken, refreshToken };
  }

  async signup({
    email,
    password,
    username,
  }: {
    email: string;
    password: string;
    username: string;
  }) {
    const existingUser = await findUserByEmail(email);
    if (existingUser) throw new AuthenticationError("Email already in use");

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await createUser({
      email,
      password: hashedPassword,
      username,
    });

    return user;
  }

  async logout(refreshToken: string, revokedByIp: string) {
    const tokenDoc = await RefreshTokenModel.findOne({ token: refreshToken });
    if (!tokenDoc || tokenDoc.isExpired)
      throw new AuthenticationError("Invalid refresh token");

    tokenDoc.revoked = new Date();
    tokenDoc.revokedByIp = revokedByIp;
    await tokenDoc.save();
  }

  async masterLogout(userId: string) {
    const user = await findUserById(userId);
    if (!user) throw new AuthenticationError("User not found");

    await RefreshTokenModel.deleteMany({ user: userId });
  }

  async refreshToken(refreshToken: string, createdByIp: string) {
    const tokenDoc = await RefreshTokenModel.findOne({
      token: refreshToken,
    }).populate("user");
    if (!tokenDoc || tokenDoc.isExpired || tokenDoc.revoked)
      throw new AuthenticationError("Invalid refresh token");

    const { user } = tokenDoc;
    if (!user) throw new AuthenticationError("User not found");

    const newAccessToken = generateToken({
      type: "AccessToken",
      payload: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    });

    const newRefreshToken = generateToken({
      type: "RefreshToken",
      payload: { id: user.id },
    });

    const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
    tokenDoc.revoked = new Date();
    tokenDoc.replacedByToken = newRefreshToken;
    tokenDoc.revokedByIp = createdByIp;
    await tokenDoc.save();

    await RefreshTokenModel.create({
      user: user.id,
      token: newRefreshToken,
      expires,
      createdByIp,
    });

    return { accessToken: newAccessToken, refreshToken: newRefreshToken };
  }

  async sendPasswordResetEmail(email: string) {
    const user = await findUserByEmail(email);
    if (!user) throw new AuthenticationError("User not found");

    const resetToken = generateToken({
      type: "PasswordResetToken",
      payload: { id: user.id },
      expiresIn: "1h",
    });

    // Send email logic here (e.g., using nodemailer)
    console.log(
      `Password reset link: https://yourapp.com/reset-password?token=${resetToken}`
    );
  }

  async resetPassword(token: string, newPassword: string) {
    const payload = verifyToken({ type: "PasswordResetToken", token });
    if (!payload || !payload.id)
      throw new AuthenticationError("Invalid reset token");

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await updateUserToken(payload.id, null); // Clear previous tokens for security
    await updateUserToken(payload.id, { password: hashedPassword });
  }

  async getProfile(userId: string) {
    const user = await findUserById(userId);
    if (!user) throw new AuthenticationError("User not found");

    return user;
  }

  async getUserById(userId: string) {
    const user = await findUserById(userId);
    if (!user) throw new AuthenticationError("User not found");

    return user;
  }
}

const authenticateService = new AuthenticateService();
export default authenticateService;
