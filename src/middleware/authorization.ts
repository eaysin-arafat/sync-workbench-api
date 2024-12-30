import AuthorizationError from "@/errors/authorization-error";
import BadRequest from "@/errors/bad-request-error";
import NotFoundError from "@/errors/not-found-error";
import { IPermission } from "@/models/Permission";
import { RolePermission } from "@/models/RolePermission";
import User from "@/models/User";
import { NextFunction, Request, Response } from "express";

const httpMethodToActionMap: { [key: string]: string } = {
  GET: "read",
  POST: "create",
  PUT: "update",
  DELETE: "delete",
  PATCH: "update",
};

const authorization = () => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?.id;
      if (!userId) throw new AuthorizationError();

      const user = await User.findById(userId).populate("role");
      if (!user) throw new NotFoundError();

      const resource = req.baseUrl.split("/").pop();
      if (!resource)
        throw new BadRequest({
          message: "Resource not specified.",
        });

      const httpMethod = req.method.toUpperCase();
      const action = httpMethodToActionMap[httpMethod];
      if (!action)
        throw new BadRequest({
          message: "Unsupported action.",
        });

      const rolePermissions = await RolePermission.find({
        role: user.role,
      }).populate<{ permission: IPermission }>("permission");

      const hasPermission = rolePermissions.some((rp) => {
        return (
          rp.permission.resource === resource && rp.permission.action === action
        );
      });

      if (!hasPermission)
        throw new AuthorizationError({
          message: `Access denied. You do not have permission to ${action} ${resource}.`,
        });

      next();
    } catch (error: any) {
      res
        .status(500)
        .json({ status: "error", statusCode: error?.statusCode || 500, error });
    }
  };
};

export default authorization;
