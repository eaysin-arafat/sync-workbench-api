import BadRequest from "@/errors/bad-request-error";
import ConflictError from "@/errors/conflict-error";
import Employee from "@/models/Employee";
import { EmployeePartialSchemaType } from "@/schemas/employee";
import mongoose from "mongoose";

const create = async (data: EmployeePartialSchemaType) => {
  const {
    user,
    first_name,
    last_name,
    address,
    city,
    country,
    date_of_birth,
    date_of_hire,
    employment_status,
    phone_number,
    position,
    salary,
    state,
    zip_code,
    certifications,
    department,
    job_title,
    manager,
    skills,
  } = data;

  if (!user) throw new BadRequest();

  const existingEmployee = await Employee.findOne({ user: user });
  if (existingEmployee) throw new ConflictError("employee", user);

  const employee = new Employee({
    user: new mongoose.Types.ObjectId(user),
    first_name,
    last_name,
    address,
    city,
    country,
    date_of_birth,
    date_of_hire,
    employment_status,
    phone_number,
    position,
    salary,
    state,
    zip_code,
    certifications,
    department,
    job_title,
    manager,
    skills,
  });

  await employee.save();
  return employee;
};

const createEmptyEmployeeForUser = async (userId: string) => {
  const existingEmployee = await Employee.findOne({ user: userId });
  if (existingEmployee) throw new ConflictError("employee", userId);

  const employeeData: EmployeePartialSchemaType = {
    user: userId,
  };

  const employee = await create(employeeData);
  return { employee };
};

export { create, createEmptyEmployeeForUser };
