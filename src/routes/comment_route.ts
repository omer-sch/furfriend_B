import express from "express";
const router = express.Router();
import CommentController from "../controllers/comment_controller";
import authMiddleware from "../common/auth_middleware";

router.get("/", CommentController.get.bind(CommentController));
router.get("/:id", CommentController.getById.bind(CommentController));
router.post("/",authMiddleware,CommentController.post.bind(CommentController));
  router.get('/count/:id', CommentController.getCommentCount);

  //router.get('/post/:postId', CommentController.getCommentsByPostId.bind(CommentController));

export default router;