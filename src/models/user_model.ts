import mongoose, { ObjectId } from "mongoose";

export interface IUser {
  name: string;
  email: string;
  password: string;
  imgUrl?: string;
  _id?: ObjectId;
  refreshTokens?: string[];
}

const userSchema = new mongoose.Schema<IUser>({
  name: {
    type: String,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  imgUrl: {
    type: String,
  },
  refreshTokens: {
    type: [String],
    required: false,
  },
});

export default mongoose.model<IUser>("User", userSchema);
