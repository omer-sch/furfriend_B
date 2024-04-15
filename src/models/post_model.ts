import mongoose, { ObjectId } from "mongoose";
import { IComment } from "./comment_model";

export interface IPost {
  title: string;
  message: string;
  owner?: ObjectId;
  _id?: ObjectId;
  comments: IComment[]; 
  postImg: string;
}

// interface Comment{
//   _id: ObjectId;
//   content: string;
//   owner: ObjectId;
//   postId: ObjectId;
//   createdAt: Date;
// }
const PostSchema = new mongoose.Schema<IPost>({
  title: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', 
    required: true,
  },
  
  // comments: {
  //   type: [mongoose.Schema.Types.ObjectId],
  //   ref: "Comment",
  //   default: [],
  //   required: true,
  // },
  comments: [
    { type: mongoose.Schema.Types.ObjectId,
       ref: 'Comment'
    }],

  postImg: {
    type: String,
    required: true,
  },
});

export default mongoose.model<IPost>("Post", PostSchema);