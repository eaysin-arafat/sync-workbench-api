// utils/employeeUtils.ts

import NotFoundError from "@/errors/not-found-error";
import Employee from "@/models/Employee";
import { IdWithPopulateType } from "@/types/quert";

const getByUserId = async ({ id, populate }: IdWithPopulateType) => {
  const query = Employee.findOne({ user: id });

  if (populate) query.populate(populate);
  const employee = await query;

  if (!employee) {
    throw new NotFoundError({
      message: `Employee not found for user with ID ${id}`,
    });
  }

  return { employee: employee.toObject() };
};

export default getByUserId;
