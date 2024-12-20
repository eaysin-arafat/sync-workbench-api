import { authenticateService } from "@/lib";
import { userSchema, UserSchemaType } from "@/schemas";
import { validateSchemas } from "@/utils";
import { NextFunction, Request, Response } from "express";

const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = validateSchemas(req.body, userSchema) as UserSchemaType;

    const { username, password, email, role, status } = data;

    const { accessToken, refreshToken } = await authenticateService.register({
      email,
      password,
      role,
      status,
      username,
    });

    const response = {
      status: "success",
      statusCode: 200,
      message: "Login successful",
      data: { accessToken, refreshToken },
    };

    res.status(201).json(response);
  } catch (error) {
    next(error);
  }
};

export default register;
