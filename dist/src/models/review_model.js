"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const ReviewSchema = new mongoose_1.default.Schema({
    trailId: {
        type: String,
        required: true,
    },
    userId: {
        type: String,
        required: true,
    },
    rating: {
        type: String,
        required: true,
    },
    comment: {
        type: String,
        required: true,
    },
});
exports.default = mongoose_1.default.model("Review", ReviewSchema);
//# sourceMappingURL=review_model.js.map