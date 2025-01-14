import { authenticateService } from "@/lib";
import { requestMiddleware } from "@/middleware/request-middleware";
import { Request, Response, Router } from "express";
import { z } from "zod";

const router = Router();

// Login Route
const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

router.post(
  "/login",
  requestMiddleware(
    async (req: Request, res: Response) => {
      const { email, password } = req.body;
      const tokens = await authenticateService.login(email, password);

      res.status(200).json({
        status: "success",
        statusCode: 200,
        message: "Login successful",
        data: tokens,
      });
    },
    { validation: { body: loginSchema } }
  )
);

// Signup Route
const signupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  username: z.string().min(3),
});

router.post(
  "/signup",
  requestMiddleware(
    async (req: Request, res: Response) => {
      const { email, password, username } = req.body;
      const user = await authenticateService.signup({
        email,
        password,
        username,
      });

      res.status(201).json({
        status: "success",
        statusCode: 201,
        message: "Signup successful",
        data: user,
      });
    },
    { validation: { body: signupSchema } }
  )
);

// Logout Route
router.post(
  "/logout",
  requestMiddleware(async (req: Request, res: Response) => {
    const { refreshToken } = req.body;
    await authenticateService.logout(refreshToken);

    res.status(200).json({
      status: "success",
      statusCode: 200,
      message: "Logout successful",
    });
  })
);

// Master Logout Route
router.post(
  "/master-logout",
  requestMiddleware(async (req: Request, res: Response) => {
    const { userId } = req.body;
    await authenticateService.masterLogout(userId);

    res.status(200).json({
      status: "success",
      statusCode: 200,
      message: "Master logout successful",
    });
  })
);

// Reauthenticate Route
const reauthSchema = z.object({
  refreshToken: z.string().min(1),
});

router.post(
  "/reauth",
  requestMiddleware(
    async (req: Request, res: Response) => {
      const { refreshToken } = req.body;
      const tokens = await authenticateService.refreshToken(refreshToken);

      res.status(200).json({
        status: "success",
        statusCode: 200,
        message: "Token refreshed successfully",
        data: tokens,
      });
    },
    { validation: { body: reauthSchema } }
  )
);

// Forgot Password Route
const forgotPasswordSchema = z.object({
  email: z.string().email(),
});

router.post(
  "/forgotpass",
  requestMiddleware(
    async (req: Request, res: Response) => {
      const { email } = req.body;
      await authenticateService.sendPasswordResetEmail(email);

      res.status(200).json({
        status: "success",
        statusCode: 200,
        message: "Password reset email sent",
      });
    },
    { validation: { body: forgotPasswordSchema } }
  )
);

// Reset Password Route
const resetPasswordSchema = z.object({
  token: z.string().min(1),
  newPassword: z.string().min(6),
});

router.post(
  "/resetpass",
  requestMiddleware(
    async (req: Request, res: Response) => {
      const { token, newPassword } = req.body;
      await authenticateService.resetPassword(token, newPassword);

      res.status(200).json({
        status: "success",
        statusCode: 200,
        message: "Password reset successfully",
      });
    },
    { validation: { body: resetPasswordSchema } }
  )
);

// Get Current User Profile
router.get(
  "/me",
  requestMiddleware(async (req: Request, res: Response) => {
    const user = await authenticateService.getProfile(req.user!.id);

    res.status(200).json({
      status: "success",
      statusCode: 200,
      data: user,
    });
  })
);

// Get User by ID
router.get(
  "/:id",
  requestMiddleware(async (req: Request, res: Response) => {
    const userId = req.params.id;
    const user = await authenticateService.getUserById(userId);

    res.status(200).json({
      status: "success",
      statusCode: 200,
      data: user,
    });
  })
);

export default router;
