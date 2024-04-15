import { Express } from "express";
import request from "supertest";
import initApp from "../app";
import mongoose from "mongoose";
import { IComment } from "../models/comment_model";
import User, { IUser } from "../models/user_model";
import Post, { IPost } from "../models/post_model";

let app: Express;
let accessToken = "";

const user: IUser = {
  name: "John Doe",
  email: "john@student.com",
  password: "1234567890",
  imgUrl: "https://www.google.com",
};

const post: IPost = {
  title: "Buddy",
  message: "The ultimate companion, Buddy is a loyal friend who's always by your side. This easygoing pup is happy for a walk or a lazy afternoon snuggle, making him the perfect furry best friend.",
  owner: user._id,
  comments: [],
  postImg: "http://localhost:3000/public\\pexels-summer-stock-333083.jpg",
};

const comment: IComment = {
  content: "test description",
  owner: user._id,
  postId: post._id,
  createdAt: new Date(),
};
const comment2: IComment = {
  content: "second comment",
  owner: user._id,
  postId: post._id,
  createdAt: new Date(),
};
beforeAll(async () => {
  app = await initApp();
  console.log("beforeAll");

  await User.deleteMany({ email: user.email });
  const response = await request(app).post("/auth/register").send(user);
  user._id = response.body._id;
  accessToken = response.body.accessToken;
  //wait for user to be created
  await User.findOne({email: user.email })
  
  const postedUser = await User.findOne({ email: user.email });
  user._id = postedUser.id;
  post.owner = postedUser.id;
  comment.owner = postedUser.id;

  comment2.owner = postedUser.id;

  // Create the post
  const postedReview = await Post.create(post);
  post._id = postedReview._id;
  comment.postId = postedReview._id;

  comment2.postId = postedReview._id;

  // Add a comment to the post
  const commentResponse = await request(app)
    .post("/comments")
    .set("Authorization", "JWT " + accessToken)
    .send(comment);
  const commentId = commentResponse.body._id;
  const commentResponse2 = await request(app)
    .post("/comments")
    .set("Authorization", "JWT " + accessToken)
    .send(comment2);
  const commentId2 = commentResponse2.body._id;

  console.log("commentId", commentId);
  post.comments.push(commentId);
  post.comments.push(commentId2);

});


afterAll(async () => {
  await mongoose.connection.close();
});

describe("Post comment test", () => {
  const addComment = async (comment: IComment) => {
    const response = await request(app)
      .post("/comments")
      .set("Authorization", "JWT " + accessToken)
      .send(comment);
      expect(response.statusCode).toBe(201);
      expect(response.body.owner).toBe(user._id);
      expect(response.body.content).toBe(comment.content);
      expect(response.body.postId).toBe(post._id.toString());
  };
 
  test("Test Add Comment", async () => {
    await addComment(comment);
    console.log("comment", comment);
  });
  
  test("Test Add Comment2", async () => {
    await addComment(comment2);
    console.log("comment", comment2);
  });
  

  test("Test posting a comment to a non-existent post", async () => {
    const invalidComment: IComment = {
      content: "test description",
      owner: user._id,
      postId: user._id,// not post id so should fail
      createdAt: new Date(),
    };
  
    const response = await request(app)
      .post("/comments")
      .set("Authorization", "JWT " + accessToken)
      .send(invalidComment);
  
    expect(response.statusCode).toBe(404);
    expect(response.body.message).toBe("post not found");
  });
  test("Test posting a comment with internal server error", async () => {
    const invalidComment = { ...comment, postId: "invalid_post_id" };
  
    const response = await request(app)
      .post("/comments") 
      .set("Authorization", "JWT " + accessToken)
      .send(invalidComment); 
  
    expect(response.statusCode).toBe(500);
    expect(response.body.message).toBe("Internal Server Error");
  });
  
  test("Test getCommentCount", async () => {

    const response = await request(app).get(`/comments/count/${post._id}`);
  
    expect(response.statusCode).toBe(200);
  
    expect(response.body.count).toBeGreaterThanOrEqual(1); 
  });
  test("Test invalid CommentCount", async () => {

    const response = await request(app).get(`/comments/count/"invalid"`);
  
    expect(response.statusCode).toBe(500);
  
  });
  
  test("Test getCommentById with valid ID", async () => {
    await addComment(comment);
    console.log("comment", comment);
    console.log("post._id", post._id);
    const response = await request(app)
      .get(`/comments/${post._id}`)
      .set("Authorization", "JWT " + accessToken);
    console.log("response", response.body);
    expect(response.statusCode).toBe(200);
  });
  
});

