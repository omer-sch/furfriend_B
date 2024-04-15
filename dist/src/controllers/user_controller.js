"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_model_1 = __importDefault(require("../models/user_model"));
const base_controller_1 = require("./base_controller");
class UserController extends base_controller_1.BaseController {
    constructor() {
        super(user_model_1.default);
    }
    async get(req, res) {
        console.log("Get Connected User: ");
        const id = req.user._id;
        try {
            const user = await user_model_1.default.findById(id).select([
                "name",
                "email",
                "imgUrl",
            ]);
            res.send(user);
        }
        catch (err) {
            res.status(500).json({ message: "unable to retrieve user data" });
        }
    }
}
exports.default = new UserController();
//# sourceMappingURL=user_controller.js.map