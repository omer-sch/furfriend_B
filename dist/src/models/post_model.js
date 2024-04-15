"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
// interface Comment{
//   _id: ObjectId;
//   content: string;
//   owner: ObjectId;
//   postId: ObjectId;
//   createdAt: Date;
// }
const PostSchema = new mongoose_1.default.Schema({
    title: {
        type: String,
        required: true,
    },
    message: {
        type: String,
        required: true,
    },
    owner: {
        type: mongoose_1.default.Schema.Types.ObjectId,
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
        { type: mongoose_1.default.Schema.Types.ObjectId,
            ref: 'Comment'
        }
    ],
    postImg: {
        type: String,
        required: true,
    },
});
exports.default = mongoose_1.default.model("Post", PostSchema);
//# sourceMappingURL=post_model.js.map