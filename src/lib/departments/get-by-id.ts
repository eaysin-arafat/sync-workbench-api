import NotFoundError from "@/errors/not-found-error";
import Employee from "@/models/Employee";
import { IdWithPopulateType } from "@/types/quert";

const getById = async ({ id, populate }: IdWithPopulateType) => {
  const query = Employee.findById(id);

  if (populate) query.populate(populate);
  const employee = await query;

  if (!employee) throw new NotFoundError();

  return { employee: employee.toObject() };
};

export default getById;
