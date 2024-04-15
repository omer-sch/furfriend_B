import User, { IUser } from "../models/user_model";
import { BaseController } from "./base_controller";
import { Response } from "express";
import { AuthRequest } from "../common/auth_middleware";

class UserController extends BaseController<IUser> {
    constructor() {
        super(User);
    }

    async get(req: AuthRequest, res: Response) {
        console.log("Get Connected User: ");
        const id = req.user._id;
    
        try {
            const user = await User.findById(id).select([
                "name",
                "email",
                "imgUrl",
            ]);
    
            res.send(user); 
        } catch (err) {
            res.status(500).json({ message: "unable to retrieve user data" });
        }
    }
    
    
}

export default new UserController();
