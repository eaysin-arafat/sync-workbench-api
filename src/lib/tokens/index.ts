import AuthenticationError from "@/errors/authentication-error";
import InternalServerError from "@/errors/internal-server-error";
import dotenv from "dotenv";
import jwt, { JwtPayload } from "jsonwebtoken";
import { AccessTokenPayload, RefreshTokenPayload } from "./types";

dotenv.config();

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || "access-secret";
const REFRESH_TOKEN_SECRET =
  process.env.REFRESH_TOKEN_SECRET || "refresh-secret";

const ACCESS_TOKEN_EXPIRATION = process.env.ACCESS_TOKEN_EXPIRATION || "15m";
const REFRESH_TOKEN_EXPIRATION = process.env.REFRESH_TOKEN_EXPIRATION || "7d";

interface GenerateTokenOptions {
  type: "AccessToken" | "RefreshToken";
  payload: AccessTokenPayload | RefreshTokenPayload;
  algorithm?: jwt.Algorithm;
  secret?: string;
  expiresIn?: string | number;
}

const generateToken = ({
  type = "AccessToken",
  payload,
  algorithm = "HS256",
  secret = ACCESS_TOKEN_SECRET,
  expiresIn = REFRESH_TOKEN_EXPIRATION,
}: GenerateTokenOptions): string => {
  expiresIn =
    type === "AccessToken" ? ACCESS_TOKEN_EXPIRATION : REFRESH_TOKEN_EXPIRATION;
  secret = type === "AccessToken" ? ACCESS_TOKEN_SECRET : REFRESH_TOKEN_SECRET;

  try {
    return jwt.sign(payload, secret, {
      algorithm,
      expiresIn,
    });
  } catch (error) {
    console.log("[JWT]", error);
    throw new InternalServerError();
  }
};

// Define the options for decoding
interface DecodeTokenOptions {
  token: string;
}

const decodeToken = ({ token }: DecodeTokenOptions): JwtPayload | null => {
  try {
    return jwt.decode(token) as JwtPayload | null;
  } catch (error) {
    console.log("[JWT]", error);
    throw new AuthenticationError();
  }
};

// Define the options for verifying the token
interface VerifyTokenOptions {
  type: "AccessToken" | "RefreshToken";
  token: string;
  algorithm?: jwt.Algorithm;
  secret?: string;
}

const verifyToken = ({
  type,
  token,
  algorithm = "HS256",
  secret = ACCESS_TOKEN_SECRET,
}: VerifyTokenOptions): AccessTokenPayload | RefreshTokenPayload => {
  secret = type === "AccessToken" ? ACCESS_TOKEN_SECRET : REFRESH_TOKEN_SECRET;

  try {
    return jwt.verify(token, secret, { algorithms: [algorithm] }) as
      | AccessTokenPayload
      | RefreshTokenPayload;
  } catch (error) {
    console.log("[JWT]", error);
    throw new AuthenticationError();
  }
};

export { decodeToken, generateToken, verifyToken };
