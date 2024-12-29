import InternalServerError from "@/errors/internal-server-error";
import NotFoundError from "@/errors/not-found-error";
import Employee from "@/models/Employee";
import { ObjectId } from "mongoose";
import { IdSchemaType } from "./../../schemas/shared/id";

const remove = async (id: IdSchemaType) => {
  const employee = await Employee.findById(id);
  if (!employee) throw new NotFoundError();

  return Employee.findByIdAndDelete(id);
};

const removeEmployeeByUserId = async (userId: ObjectId) => {
  try {
    const result = await Employee.deleteOne({ user: userId });
    if (result.deletedCount === 0)
      throw new NotFoundError({
        message: `Employee for user ${userId} not found`,
      });
  } catch (error) {
    console.error(`Error deleting employee for user ${userId}:`, error);
    throw new InternalServerError({
      message: `Failed to delete employee for user ${userId}`,
    });
  }
};

export { remove, removeEmployeeByUserId };
