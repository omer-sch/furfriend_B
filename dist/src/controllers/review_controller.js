// import Review, { IReview} from "../models/review_model";
// import { BaseController } from "./base_controller";
// import { Response } from "express";
// import { Request } from "express";
// class ReviewController extends BaseController<IReview> {
//     constructor() {
//         super(Review);
//     }
//     async getAllReviews(req: Request, res: Response) {
//         try {
//             const reviews = await Review.find();
//             res.status(200).json(reviews);
//         } catch (error) {
//             res.status(500).json({ error: 'Internal server error' });
//         }
//     }
//     // Get review by ID
//     async getReviewById(req: Request, res: Response) {
//         const { id } = req.params;
//         try {
//             const review = await Review.findById(id);
//             if (!review) {
//                 return res.status(404).json({ error: 'Review not found' });
//             }
//             res.status(200).json(review);
//         } catch (error) {
//             res.status(500).json({ error: 'Internal server error' });
//         }
//     }
//     // Create a new review
//     async createReview(req: Request, res: Response) {
//         const { trailId, userId, rating, comment } = req.body;
//         // Check if rating is between 1 and 5
//         if (rating < 1 || rating > 5) {
//             return res.status(400).json({ error: 'Rating must be between 1 and 5' });
//         }
//         try {
//             const stars = Array(rating).fill('★').join('');
//             const review = await Review.create({ trailId, userId, rating: stars, comment });
//             res.status(201).json(review);
//         } catch (error) {
//             res.status(400).json({ error: 'Bad request' });
//         }
//     }
//     // Update a review
//     async updateReview(req: Request, res: Response) {
//         const { id } = req.params;
//         const { rating, comment } = req.body;
//         // Check if rating is between 1 and 5
//         if (rating < 1 || rating > 5) {
//             return res.status(400).json({ error: 'Rating must be between 1 and 5' });
//         }
//         try {
//             const stars = Array(rating).fill('★').join('');
//             const updatedReview = await Review.findByIdAndUpdate(id, { rating: stars, comment }, { new: true });
//             if (!updatedReview) {
//                 return res.status(404).json({ error: 'Review not found' });
//             }
//             res.status(200).json(updatedReview);
//         } catch (error) {
//             res.status(400).json({ error: 'Bad request' });
//         }
//     }
//     // Delete a review
//     async deleteReview(req: Request, res: Response) {
//         const { id } = req.params;
//         try {
//             const deletedReview = await Review.findByIdAndDelete(id);
//             if (!deletedReview) {
//                 return res.status(404).json({ error: 'Review not found' });
//             }
//             res.status(204).end();
//         } catch (error) {
//             res.status(500).json({ error: 'Internal server error' });
//         }
//     }
// }
// export default new ReviewController();
//# sourceMappingURL=review_controller.js.map