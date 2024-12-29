import NotFoundError from "@/errors/not-found-error";
import Employee from "@/models/Employee";
import { IdWithPopulateType } from "@/types/quert";

const getById = async ({ id, populate }: IdWithPopulateType) => {
  const employeeQuery = Employee.findById(id);

  if (populate) employeeQuery.populate(populate);
  const employee = await employeeQuery;

  if (!employee) throw new NotFoundError();

  return { employee: employee.toObject() };
};

export default getById;
