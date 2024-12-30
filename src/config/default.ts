const defaultConfig = Object.freeze({
  publicRoute: [
    "/api/v1/auth/login",
    "/api/v1/auth/register",
    "/api/v1/auth/refresh-token",
    "/dev/api-docs/",
  ],
  allowUserRoles: ["hr", "admin", "manager", "employee"],
  allowedUserPopulateFields: ["role"],
  allowedRolePermissionPopulateFields: ["role", "permission"],
  allowEmployeePopulateFields: [""],
});

export default defaultConfig;
