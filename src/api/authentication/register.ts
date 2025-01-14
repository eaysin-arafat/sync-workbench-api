import { authenticateService } from "@/lib";
import { requestMiddleware } from "@/middleware/request-middleware";
import { NextFunction, Request, Response } from "express";
import { userSchema, UserSchemaType } from "../../schemas/user";

const register = async (
  req: Request<{}, {}, UserSchemaType>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { username, password, email, role, status } = req.body;

    const { accessToken, refreshToken } = await authenticateService.register({
      email,
      password,
      role,
      status,
      username,
    });

    const response = {
      status: "success",
      statusCode: 201,
      message: "Login successful",
      data: { accessToken, refreshToken },
    };

    res.status(201).json(response);
  } catch (error) {
    next(error);
  }
};

export default requestMiddleware(register, {
  validation: { body: userSchema },
});
