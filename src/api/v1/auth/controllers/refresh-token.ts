import { authService } from "@/library";
import { badRequest, generateErrorResponse } from "@/utils";
import { NextFunction, Request, Response } from "express";

const refreshToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { refreshToken } = req.body;

  if (!refreshToken) next(generateErrorResponse(badRequest));

  try {
    const accessToken = await authService.refreshToken(refreshToken);

    res.status(200).json({
      code: 200,
      message: "Token refreshed successfully",
      data: {
        accessToken,
      },
    });
  } catch (error) {
    next(error);
  }
};

export default refreshToken;
