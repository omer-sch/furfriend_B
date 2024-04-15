import express from "express";
const router = express.Router();
import PostController from "../controllers/post_controller";
import authMiddleware from "../common/auth_middleware";

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
router.get("/", PostController.get.bind(PostController));

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
router.get("/:id", PostController.getById.bind(PostController));

router.get("/userId/:id",PostController.getByUserId.bind(PostController));

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
router.post("/", authMiddleware, PostController.post.bind(PostController));

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
router.put("/:id", authMiddleware, PostController.putById2.bind(PostController));

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

router.delete("/:id", authMiddleware, PostController.deleteById.bind(PostController));

export default router;