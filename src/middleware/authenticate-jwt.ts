import AuthenticationError from "@/errors/authentication-error";
import { verifyToken } from "@/lib/tokens";
import { NextFunction, Request, Response } from "express";

export const authenticateJWT = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    const errorPayload = new AuthenticationError({
      message: "Access denied. No token provided.",
    });

    return res.status(errorPayload.statusCode).json(errorPayload);
  }

  try {
    const decoded = verifyToken({ type: "AccessToken", token });
    req.user = decoded;

    next();
  } catch (error) {
    const errorPayload = new AuthenticationError({
      message: "Invalid token or token has expired.",
    }).toErrorResponse();

    return res.status(errorPayload?.statusCode).json(errorPayload);
  }
};
