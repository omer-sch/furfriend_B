"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const app_1 = __importDefault(require("../app"));
const mongoose_1 = __importDefault(require("mongoose"));
const user_model_1 = __importDefault(require("../models/user_model"));
const post_model_1 = __importDefault(require("../models/post_model"));
let app;
let accessToken = "";
const user = {
    name: "John Doe",
    email: "john@student.com",
    password: "1234567890",
    imgUrl: "https://www.google.com",
};
const post = {
    title: "Buddy",
    message: "The ultimate companion, Buddy is a loyal friend who's always by your side. This easygoing pup is happy for a walk or a lazy afternoon snuggle, making him the perfect furry best friend.",
    owner: user._id,
    comments: [],
    postImg: "http://localhost:3000/public\\pexels-summer-stock-333083.jpg",
};
const comment = {
    content: "test description",
    owner: user._id,
    postId: post._id,
    createdAt: new Date(),
};
const comment2 = {
    content: "second comment",
    owner: user._id,
    postId: post._id,
    createdAt: new Date(),
};
beforeAll(async () => {
    app = await (0, app_1.default)();
    console.log("beforeAll");
    await user_model_1.default.deleteMany({ email: user.email });
    const response = await (0, supertest_1.default)(app).post("/auth/register").send(user);
    user._id = response.body._id;
    accessToken = response.body.accessToken;
    //wait for user to be created
    await user_model_1.default.findOne({ email: user.email });
    const postedUser = await user_model_1.default.findOne({ email: user.email });
    user._id = postedUser.id;
    post.owner = postedUser.id;
    comment.owner = postedUser.id;
    comment2.owner = postedUser.id;
    // Create the post
    const postedReview = await post_model_1.default.create(post);
    post._id = postedReview._id;
    comment.postId = postedReview._id;
    comment2.postId = postedReview._id;
    // Add a comment to the post
    const commentResponse = await (0, supertest_1.default)(app)
        .post("/comments")
        .set("Authorization", "JWT " + accessToken)
        .send(comment);
    const commentId = commentResponse.body._id;
    const commentResponse2 = await (0, supertest_1.default)(app)
        .post("/comments")
        .set("Authorization", "JWT " + accessToken)
        .send(comment2);
    const commentId2 = commentResponse2.body._id;
    console.log("commentId", commentId);
    post.comments.push(commentId);
    post.comments.push(commentId2);
});
afterAll(async () => {
    await mongoose_1.default.connection.close();
});
describe("Post comment test", () => {
    const addComment = async (comment) => {
        const response = await (0, supertest_1.default)(app)
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
        const invalidComment = {
            content: "test description",
            owner: user._id,
            postId: user._id, // not post id so should fail
            createdAt: new Date(),
        };
        const response = await (0, supertest_1.default)(app)
            .post("/comments")
            .set("Authorization", "JWT " + accessToken)
            .send(invalidComment);
        expect(response.statusCode).toBe(404);
        expect(response.body.message).toBe("post not found");
    });
    test("Test posting a comment with internal server error", async () => {
        const invalidComment = Object.assign(Object.assign({}, comment), { postId: "invalid_post_id" });
        const response = await (0, supertest_1.default)(app)
            .post("/comments")
            .set("Authorization", "JWT " + accessToken)
            .send(invalidComment);
        expect(response.statusCode).toBe(500);
        expect(response.body.message).toBe("Internal Server Error");
    });
    test("Test getCommentCount", async () => {
        const response = await (0, supertest_1.default)(app).get(`/comments/count/${post._id}`);
        expect(response.statusCode).toBe(200);
        expect(response.body.count).toBeGreaterThanOrEqual(1);
    });
    test("Test invalid CommentCount", async () => {
        const response = await (0, supertest_1.default)(app).get(`/comments/count/"invalid"`);
        expect(response.statusCode).toBe(500);
    });
    test("Test getCommentById with valid ID", async () => {
        await addComment(comment);
        console.log("comment", comment);
        console.log("post._id", post._id);
        const response = await (0, supertest_1.default)(app)
            .get(`/comments/${post._id}`)
            .set("Authorization", "JWT " + accessToken);
        console.log("response", response.body);
        expect(response.statusCode).toBe(200);
    });
});
//# sourceMappingURL=comment.test.js.map