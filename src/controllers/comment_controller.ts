
import Comment, { IComment } from "../models/comment_model";
import Post from "../models/post_model";
import { BaseController } from "./base_controller";
import { Response } from "express";
import { AuthRequest } from "../common/auth_middleware";

class CommentController extends BaseController<IComment> {
  constructor() {
    super(Comment);
  }
  
  async post(req: AuthRequest, res: Response) {
    try {
      const userId = req.user._id;
      const { content , postId} = req.body;

      const postFind = await Post.findById(postId);
      if (!postFind) {
        res.status(404).json({ message: "post not found" });
        return;
      }

      const comment = await Comment.create({
        content,
        owner: userId,
        postId: postFind.id,
        createdAt: new Date(),
      });
      postFind.comments.push(comment.id);

      await postFind.save();
      res.status(201).json(comment);
    } catch (error) {
      res.status(500).json({ message: "Internal Server Error" });
    }
  }

//   async getCommentsByPostId(req: AuthRequest, res: Response) {
//     try {
//         const postId = req.params.postId;
//         const comments = await Comment.find({ postId }).populate('owner');
//         res.status(200).json(comments);
//     } catch (error) {
//         console.error("Error fetching comments by post ID:", error);
//         res.status(500).json({ message: "Failed to fetch comments by post ID" });
//     }
// }

  async getCommentCount(req: AuthRequest, res: Response) {
    try {
        const postId = req.params.id; // Corrected route parameter
        console.log("Post ID:", postId);
        const commentCount = await Comment.countDocuments({ postId });
        console.log("Comment count:", commentCount);

        res.send({ count: commentCount });
    } catch (err) {
        console.error("Error:", err.message);
        res.status(500).json({ message: err.message });
    }
}
}


export default new CommentController();

// import Comment, { IComment } from "../models/comment_model";
// import Post from "../models/post_model";
// import { BaseController } from "./base_controller";
// import { Response } from "express";
// import { AuthRequest } from "../common/auth_middleware";

// class CommentController extends BaseController<IComment> {
//   constructor() {
//     super(Comment);
//   }
  
//   async post(req: AuthRequest, res: Response) {
//     try {
//       const userId = req.user._id;
//       const { content , postId} = req.body;

//       const postFind = await Post.findById(postId);
//       if (!postFind) {
//         res.status(404).json({ message: "post not found" });
//         return;
//       }

//       const comment = await Comment.create({
//         content,
//         owner: userId,
//         postId: postFind.id,
//         createdAt: new Date(),
//       });
//       postFind.comments.push(comment.id);

//       await postFind.save();
//       res.status(201).json(comment);
//     } catch (error) {
//       res.status(500).json({ message: "Internal Server Error" });
//     }
//   }

// //   async getCommentsByPostId(req: AuthRequest, res: Response) {
// //     try {
// //         const postId = req.params.postId;
// //         const comments = await Comment.find({ postId }).populate('owner');
// //         res.status(200).json(comments);
// //     } catch (error) {
// //         console.error("Error fetching comments by post ID:", error);
// //         res.status(500).json({ message: "Failed to fetch comments by post ID" });
// //     }
// // }

//   async getCommentCount(req: AuthRequest, res: Response) {
//     try {
//         const postId = req.params.id; // Corrected route parameter
//         console.log("Post ID:", postId);
//         const commentCount = await Comment.countDocuments({ postId });
//         console.log("Comment count:", commentCount);

//         res.send({ count: commentCount });
//     } catch (err) {
//         console.error("Error:", err.message);
//         res.status(500).json({ message: err.message });
//     }
// }
// }


// export default new CommentController();

