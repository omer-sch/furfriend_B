import Post, { IPost } from "../models/post_model";
import Comment from "../models/comment_model";
import { BaseController } from "./base_controller";
import { Response } from "express";
import { AuthRequest } from "../common/auth_middleware";

class PostController extends BaseController<IPost> {
    constructor() {
        super(Post);
    }

    async post(req: AuthRequest, res: Response) {
        console.log("Post: " + req.body);
        const userId = req.user._id;
        req.body.owner = userId;

        super.post(req, res);
    }
    async deleteById(req: AuthRequest, res: Response) {
        try {
          await Comment.deleteMany({ reviewId: req.params.id });
        } catch (error) {
          res.status(500).json({ message: "Could not delete comments" });
        }
        console.log("Delete Post by Id:" + req.params.id);
        super.deleteById(req, res);
      }
     
       
    async putById2(req: AuthRequest, res: Response) {
        console.log("Put Post by Id:" + req.params.id);
        super.putById(req, res);
    }
    async getByUserId(req: AuthRequest, res: Response) {
      try {
        const userId = req.query.userId;
        const obj = await this.model.find({owner : userId});
        res.status(200).json(obj);
      } catch (err) {
        res.status(406).send("fail: " + err.message);
      }
    }
    async getById(req: AuthRequest, res: Response) {
      console.log("Get Post by Id:" + req.params.id);
      try {
        const p = await Post.findById(req.params.id)
          .populate([{ path: "owner", select: "name imgUrl" }])
          .populate({
            path: "comments",
            select: "message title owner postId",
            populate: { path: "owner", select: "name imgUrl" },
          });
        res.status(201).send(p);
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
      }
    }
  
    
}

export default new PostController();
