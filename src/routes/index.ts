import { Router } from "express";

import authRoutes from "./auth";
import employeesRoutes from "./employees";
import permissionsRoutes from "./permissions";
import rolePermissionsRoutes from "./rolePermissions";
import rolesRoutes from "./roles";
import usersRoutes from "./users";

const router = Router();

router.use("/users", usersRoutes);
router.use("/auth", authRoutes);
router.use("/employees", employeesRoutes);
router.use("/roles", rolesRoutes);
router.use("/permissions", permissionsRoutes);
router.use("/role-permissions", rolePermissionsRoutes);

export default router;
