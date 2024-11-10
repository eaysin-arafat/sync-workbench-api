import { rolePermissionsControllers } from "@/api";
import { Router } from "express";

const rolePermissionsRoutes = Router();

rolePermissionsRoutes
  .route("/")
  .get(rolePermissionsControllers.getAll)
  .post(rolePermissionsControllers.create);

rolePermissionsRoutes
  .route("/:id")
  .get(rolePermissionsControllers.getById)
  .put(rolePermissionsControllers.upsert)
  .patch(rolePermissionsControllers.partialUpdate)
  .delete(rolePermissionsControllers.remove);

export default rolePermissionsRoutes;
