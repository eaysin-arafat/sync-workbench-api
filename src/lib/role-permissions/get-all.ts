import ResourceNotFoundError from "@/errors/resource-not-found-error";
import { RolePermission } from "@/models/RolePermission";
import {
  preparePagination,
  prepareSearchQuery,
  prepareSortOptions,
} from "@/utils/queries";
import { RolePermissionQuerySchemaType } from "../../schemas/role-permission";

const allowedExpendFields = ["role", "permission"];

const getAll = async (data: RolePermissionQuerySchemaType) => {
  const { limit, page, sort_by, sort_type, expend, search } = data;

  const invalidExpendFields = expend?.filter(
    (field: string) => !allowedExpendFields.includes(field)
  );

  if (invalidExpendFields?.length > 0)
    throw new ResourceNotFoundError(
      invalidExpendFields.join(", "),
      allowedExpendFields.join(", ")
    );

  const sortOptions = prepareSortOptions(sort_by, sort_type);

  const searchFields = ["role", "permission"];
  const searchQuery = prepareSearchQuery(search, searchFields);

  const total = await RolePermission.countDocuments(searchQuery);
  const { skip, pagination } = preparePagination({ limit, page, total });

  const expendFields = Array.isArray(expend) ? expend : [];

  const rolePermissions = await RolePermission.find(searchQuery)
    .skip(skip)
    .limit(limit || 10)
    .sort(sortOptions)
    .populate(expendFields);

  return { rolePermissions, pagination };
};

export default getAll;
