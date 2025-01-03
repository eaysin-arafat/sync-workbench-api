import { Document, Model, Schema, model } from "mongoose";

export interface IBook extends Document {
  /** Name of the book */
  name: string;
  /** Name of the author */
  author: string;
  createdAt: Date;
  updatedAt: Date;
}

interface IBookModel extends Model<IBook> {}

const schema = new Schema<IBook>(
  {
    name: { type: String, required: true },
    author: { type: String, required: true },
  },
  { timestamps: true }
);

const Book: IBookModel = model<IBook, IBookModel>("Book", schema);

export default Book;
