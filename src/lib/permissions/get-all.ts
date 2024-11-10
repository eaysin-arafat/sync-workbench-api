import { Permission } from "@/model/Permission";
import { GetAllQuerySchemaType } from "@/schemas/shared/get-all-queries";
import {
  preparePagination,
  prepareSearchQuery,
  prepareSortOptions,
} from "@/utils/queries";

const getAll = async (data: GetAllQuerySchemaType) => {
  const { limit, page, sortBy, sortType, search } = data;

  const sortOptions = prepareSortOptions(sortBy, sortType);

  const searchFields = ["resource"];
  const searchQuery = prepareSearchQuery(search, searchFields);

  const total = await Permission.countDocuments(searchQuery);
  const { skip, pagination } = preparePagination({ limit, page, total });

  const permissions = await Permission.find(searchQuery)
    .skip(skip)
    .limit(limit || 10)
    .sort(sortOptions);

  return { permissions, pagination };
};

export default getAll;
