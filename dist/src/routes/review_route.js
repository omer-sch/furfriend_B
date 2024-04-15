// import express from "express";
// const router = express.Router();
// import ReviewController from "../controllers/review_controller";
// import authMiddleware from "../common/auth_middleware";
// /**
//  * @swagger
//  * tags:
//  *   name: Reviews
//  *   description: The Reviews API
//  */
// /**
//  * @swagger
//  * components:
//  *  schemas:
//  *   Review:
//  *    type: object
//  *   required:
//  *   - trailId
//  *  - userId
//  * - rating
//  * - comment
//  *   properties:
//  *    trailId:
//  *    type: string
//  *   description: The ID of the trail
//  *   userId:
//  *   type: string
//  *  description: The ID of the user
//  * rating:
//  * type: number
//  * description: The rating of the trail
//  * comment:
//  * type: string
//  * description: The comment of the trail
//  * example:
//  * trailId: 5f4e3f3f3f3f3f3f3f3f3f3f
//  * userId: 5f4e3f3f3f3f3f3f3f3f3f3f
//  * rating: 5
//  * comment: This trail is amazing!
//  *  */
// /**
//  * @swagger
//  * /reviews:
//  *  get:
//  *  summary: Returns the list of all the reviews
//  * tags: [Reviews]
//  * responses:
//  * 200:
//  * description: The list of the reviews
//  * content:
//  * application/json:
//  * schema:
//  * type: array
//  * items:
//  * $ref: '#/components/schemas/Review'
//  * */
// router.get("/", ReviewController.getAllReviews.bind(ReviewController));
// /**
//  *  * @swagger
//  * * /reviews/{id}:
//  * * get:
//  * * summary: Retrieve a single review by ID
//  * * tags: [Reviews]
//  * * parameters:
//  * * - in: path
//  * * name: id
//  * * required: true
//  * * schema:
//  * * type: string
//  * * description: The ID of the review
//  * * responses:
//  * * 200:
//  * * description: A single review
//  * * content:
//  * * application/json:
//  * * schema:
//  * * $ref: '#/components/schemas/Review'
//  * * 404:
//  * * description: Review not found
//  * */
// router.get("/:id", ReviewController.getReviewById.bind(ReviewController));
// /**
//  * @swagger
//  * /reviews:
//  * post:
//  * summary: Create a new review
//  * tags: [Reviews]
//  * security:
//  * - bearerAuth: []
//  * requestBody:
//  * required: true
//  * content:
//  * application/json:
//  * schema:
//  * $ref: '#/components/schemas/Review'
//  * responses:
//  * 201:
//  * description: Created
//  * content:
//  * application/json:
//  * schema:
//  * $ref: '#/components/schemas/Review'
//  * 400:
//  * description: Bad request
//  * */
// router.post("/", authMiddleware, ReviewController.createReview.bind(ReviewController));
// /**
//  * @swagger
//  * /reviews/{id}:
//  * put:
//  * summary: Update a review
//  * tags: [Reviews]
//  * security:
//  * - bearerAuth: []
//  * parameters:
//  * - in: path
//  * name: id
//  * required: true
//  * schema:
//  * type: string
//  * description: The ID of the review
//  * requestBody:
//  * required: true
//  * content:
//  * application/json:
//  * schema:
//  * $ref: '#/components/schemas/Review'
//  * responses:
//  * 200:
//  * description: The review
//  * content:
//  * application/json:
//  * schema:
//  * $ref: '#/components/schemas/Review'
//  * 404:
//  * description: Review not found
//  * 400:
//  * description: Bad request
//  * */
// router.put("/:id", authMiddleware, ReviewController.updateReview.bind(ReviewController));
// /**
//  * @swagger
//  * /reviews/{id}:
//  * delete:
//  * summary: Delete a review
//  * tags: [Reviews]
//  * security:
//  * - bearerAuth: []
//  * parameters:
//  * - in: path
//  * name: id
//  * required: true
//  * schema:
//  * type: string
//  * description: The ID of the review
//  * responses:
//  * 204:
//  * description: Review deleted
//  * 404:
//  * description: Review not found
//  * 500:
//  * description: Internal server error
//  * */
// router.delete("/:id", authMiddleware, ReviewController.deleteReview.bind(ReviewController));
// export default router;
//# sourceMappingURL=review_route.js.map