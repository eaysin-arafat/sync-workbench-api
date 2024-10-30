import { authService } from "@/lib";
import { LoginSchema } from "@/schemas/login";
import { validateSchema } from "@/utils";
import { NextFunction, Request, Response } from "express";

const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = validateSchema(LoginSchema, req.body);
    const { username, password } = data;

    const { accessToken, refreshToken } = await authService.login({
      username,
      password,
    });

    const response = {
      code: 200,
      message: "Login successful",
      data: {
        accessToken,
        refreshToken,
      },
    };

    res.status(201).json(response);
  } catch (error) {
    next(error);
  }
};

export default login;