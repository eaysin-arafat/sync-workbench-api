import { IPermission } from "@/models/Permission";
import { RolePermission } from "@/models/RolePermission";
import User from "@/models/User";
import { authorizationError, generateErrorResponse } from "@/utils";
import { NextFunction, Request, Response } from "express";
import { badRequest, notFoundError } from "./../utils/errors";

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
      if (!userId) throw generateErrorResponse(authorizationError);

      const user = await User.findById(userId).populate("role");
      if (!user) throw generateErrorResponse(notFoundError);

      const resource = req.baseUrl.split("/").pop();
      if (!resource)
        throw generateErrorResponse({
          ...badRequest,
          message: "Resource not specified.",
        });

      const httpMethod = req.method.toUpperCase();
      const action = httpMethodToActionMap[httpMethod];
      if (!action)
        throw generateErrorResponse({
          ...badRequest,
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
        throw generateErrorResponse({
          ...authorizationError,
          message: `Access denied. You do not have permission to ${action} ${resource}.`,
        });

      next();
    } catch (error) {
      res.status(500).json({ message: "Authorization error", error });
    }
  };
};

export default authorization;
