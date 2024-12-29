import { authenticateService } from "@/lib";
import { requestMiddleware } from "@/middleware/request-middleware";
import { NextFunction, Request, RequestHandler, Response } from "express";
import { z } from "zod";

// Define the validation schema using zod
const loginSchema = z.object({
  username: z.string().min(1, { message: "Username is required" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters long" }),
});

type LoginReqBody = z.infer<typeof loginSchema>;

const login: RequestHandler = async (
  req: Request<{}, {}, LoginReqBody>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { username, password } = req.body;

    const { accessToken, refreshToken } = await authenticateService.login({
      username,
      password,
    });

    console.log({ accessToken, refreshToken });

    const response = {
      status: "success",
      statusCode: 200,
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

export default requestMiddleware(login, {
  validation: { body: loginSchema },
});
