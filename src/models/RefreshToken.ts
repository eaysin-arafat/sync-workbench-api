import mongoose, { Document, Model, Schema } from "mongoose";

interface IRefreshToken {
  user: mongoose.Types.ObjectId;
  token: string;
  expires: Date;
  created: Date;
  createdByIp: string;
  revoked?: Date;
  revokedByIp?: string;
  replacedByToken?: string;
  isExpired?: boolean;
  isActive?: boolean;
}

interface IRefreshTokenDocument extends IRefreshToken, Document {}

const RefreshTokenSchema: Schema<IRefreshTokenDocument> = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  token: { type: String, required: true },
  expires: { type: Date, required: true },
  created: { type: Date, default: Date.now },
  createdByIp: { type: String, required: true },
  revoked: { type: Date },
  revokedByIp: { type: String },
  replacedByToken: { type: String },
});

RefreshTokenSchema.virtual("isExpired").get(function () {
  return Date.now() >= this.expires;
});

RefreshTokenSchema.virtual("isActive").get(function () {
  return !this.revoked && !this.isExpired;
});

RefreshTokenSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: (doc, ret) => {
    delete ret._id;
    delete ret.id;
    delete ret.user;
  },
});

const RefreshTokenModel: Model<IRefreshTokenDocument> =
  mongoose.model<IRefreshTokenDocument>("RefreshToken", RefreshTokenSchema);

export default RefreshTokenModel;
