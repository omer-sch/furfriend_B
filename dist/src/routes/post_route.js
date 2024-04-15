"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const post_controller_1 = __importDefault(require("../controllers/post_controller"));
const auth_middleware_1 = __importDefault(require("../common/auth_middleware"));
/**
* @swagger
* tags:
*   name: User Posts
*   description: API endpoints for managing user posts
*/
/**
* @swagger
* components:
*   schemas:
*     Post:
*       type: object
*       required:
*         - title
*         - content
*       example:
*         title: 'Sample Title'
*         content: 'Sample content for the  post'
*/
/**
* @swagger
* /get:
*   get:
*     summary: Retrieve a list of all  posts
*     tags: [ Posts]
*     responses:
*       200:
*         description: A list of  posts
*         content:
*           application/json:
*             schema:
*               type: array
*               items:
*                 $ref: '#/components/schemas/Post'
*/
router.get("/", post_controller_1.default.get.bind(post_controller_1.default));
/**
* @swagger
* /get/{id}:
*   get:
*     summary: Retrieve a single  post by ID
*     tags: [ Posts]
*     parameters:
*       - in: path
*         name: id
*         required: true
*         schema:
*           type: string
*         description: The ID of the  post
*     responses:
*       200:
*         description: The  get
*         content:
*           application/json:
*             schema:
*               $ref: '#/components/schemas/Post'
*       404:
*         description:  post not found
*/
router.get("/:id", post_controller_1.default.getById.bind(post_controller_1.default));
router.get("/userId/:id", post_controller_1.default.getByUserId.bind(post_controller_1.default));
/**
* @swagger
* /posts:
*   post:
*     summary: Create a new  post
*     tags: [ Posts]
*     security:
*       - bearerAuth: []
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             $ref: '#/components/schemas/Post'
*     responses:
*       200:
*         description: The created  post
*         content:
*           application/json:
*             schema:
*               $ref: '#/components/schemas/Post'
*       401:
*         description: Unauthorized, authentication token is missing or invalid
*/
router.post("/", auth_middleware_1.default, post_controller_1.default.post.bind(post_controller_1.default));
/**
* @swagger
* /put/{id}:
*   put:
*     summary: Update an existing  post
*     tags: [ Posts]
*     security:
*       - bearerAuth: []
*     parameters:
*       - in: path
*         name: id
*         required: true
*         schema:
*           type: string
*         description: The ID of the  post
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             $ref: '#/components/schemas/Post'
*     responses:
*       200:
*         description: The updated  post
*         content:
*           application/json:
*             schema:
*               $ref: '#/components/schemas/Post'
*       401:
*         description: Unauthorized, authentication token is missing or invalid
*       404:
*         description:  post not found
*/
router.put("/:id", auth_middleware_1.default, post_controller_1.default.putById2.bind(post_controller_1.default));
/**
* @swagger
* /delete/{id}:
*   delete:
*     summary: Delete a  post by ID
*     tags: [ Posts]
*     security:
*       - bearerAuth: []
*     parameters:
*       - in: path
*         name: id
*         required: true
*         schema:
*           type: string
*         description: The ID of the  post
*     responses:
*       200:
*         description:  post deleted successfully
*       401:
*         description: Unauthorized, authentication token is missing or invalid
*       404:
*         description:  post not found
*/
router.delete("/:id", auth_middleware_1.default, post_controller_1.default.deleteById.bind(post_controller_1.default));
exports.default = router;
//# sourceMappingURL=post_route.js.map