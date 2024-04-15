"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_model_1 = __importDefault(require("../models/user_model"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const google_auth_library_1 = require("google-auth-library");
const accessTokenExpiration = parseInt(process.env.JWT_EXPIRATION_MILL);
const client = new google_auth_library_1.OAuth2Client();
const googleSignin = async (req, res) => {
    console.log(req.body);
    try {
        const ticket = await client.verifyIdToken({
            idToken: req.body.credential,
            audience: process.env.GOOGLE_CLIENT_ID,
        });
        const payload = ticket.getPayload();
        const email = payload === null || payload === void 0 ? void 0 : payload.email;
        if (email != null) {
            let user = await user_model_1.default.findOne({ 'email': email });
            if (user == null) {
                user = await user_model_1.default.create({
                    'name': payload === null || payload === void 0 ? void 0 : payload.name,
                    'email': email,
                    'imgUrl': payload === null || payload === void 0 ? void 0 : payload.picture,
                    'password': '1234'
                });
            }
            const tokens = await generateTokens(user);
            res.cookie("refresh", tokens.refreshToken, {
                httpOnly: true,
                path: "/auth",
            });
            res.cookie("access", tokens.accessToken, {
                httpOnly: true,
                maxAge: accessTokenExpiration,
            });
            return res.status(200).send(Object.assign({ name: user.name, email: user.email, _id: user._id, imgUrl: user.imgUrl }, tokens));
        }
        else {
            // Handle unexpected conditions
            return res.status(400).send("Email is null or empty");
        }
    }
    catch (err) {
        return res.status(401).send(err.message);
    }
};
const register = async (req, res) => {
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;
    const imgUrl = req.body.imgUrl;
    if (!email || !password || !name) {
        return res.status(400).send("missing email or password");
    }
    try {
        const rs = await user_model_1.default.findOne({ 'email': email });
        if (rs != null) {
            return res.status(406).send("email already exists");
        }
        const salt = await bcrypt_1.default.genSalt(10);
        const encryptedPassword = await bcrypt_1.default.hash(password, salt);
        const rs2 = await user_model_1.default.create({
            'name': name,
            'email': email,
            'password': encryptedPassword,
            'imgUrl': imgUrl
        });
        const tokens = await generateTokens(rs2);
        res.cookie("refresh", tokens.refreshToken, {
            httpOnly: true,
            path: "/auth",
        });
        res.cookie("access", tokens.accessToken, {
            httpOnly: true,
            maxAge: accessTokenExpiration,
        });
        res.status(201).send(Object.assign({ name: rs2.name, email: rs2.email, _id: rs2._id, imgUrl: rs2.imgUrl }, tokens));
        // return res.status(201).send(rs2)
    }
    catch (err) {
        return res.status(400).send("error missing email or password");
    }
};
const generateTokens = async (user) => {
    const accessToken = jsonwebtoken_1.default.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRATION, });
    const refreshToken = jsonwebtoken_1.default.sign({ _id: user._id }, process.env.JWT_REFRESH_SECRET);
    if (user.refreshTokens == null) {
        user.refreshTokens = [refreshToken];
    }
    else if (!user.refreshTokens.includes(refreshToken)) {
        user.refreshTokens.push(refreshToken);
    }
    await user.save();
    return {
        accessToken,
        refreshToken,
    };
};
const login = async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    if (!email || !password) {
        return res.status(400).send("missing email or password");
    }
    try {
        const user = await user_model_1.default.findOne({ 'email': email });
        if (user == null) {
            return res.status(401).send("email or password incorrect");
        }
        const match = await bcrypt_1.default.compare(password, user.password);
        if (!match) {
            return res.status(401).send("password incorrect");
        }
        const tokens = await generateTokens(user);
        res.cookie("refresh", tokens.refreshToken, {
            httpOnly: true,
            path: "/auth",
        });
        res.cookie("access", tokens.accessToken, {
            httpOnly: true,
            maxAge: accessTokenExpiration,
        });
        return res.status(200).send(tokens);
    }
    catch (err) {
        return res.status(400).send("error missing email or password");
    }
};
const logout = async (req, res) => {
    const authHeader = req.headers['authorization'];
    const refreshToken = authHeader && authHeader.split(' ')[1]; // Bearer <token>
    if (refreshToken == null)
        return res.sendStatus(401);
    jsonwebtoken_1.default.verify(refreshToken, process.env.JWT_REFRESH_SECRET, async (err, user) => {
        console.log(err);
        if (err)
            return res.sendStatus(401);
        try {
            const userDb = await user_model_1.default.findOne({ '_id': user._id });
            if (!userDb.refreshTokens || !userDb.refreshTokens.includes(refreshToken)) {
                userDb.refreshTokens = [];
                await userDb.save();
                return res.status(401).send("Invalid refresh token");
            }
            else {
                userDb.refreshTokens = userDb.refreshTokens.filter(t => t !== refreshToken);
                await userDb.save();
                return res.sendStatus(200).send("Logout successful");
            }
        }
        catch (err) {
            res.status(500).send(err.message);
        }
    });
};
const refresh = async (req, res) => {
    const authHeader = req.headers['authorization'];
    const refreshToken = authHeader && authHeader.split(' ')[1]; // Bearer <token>
    if (refreshToken == null)
        return res.sendStatus(401);
    jsonwebtoken_1.default.verify(refreshToken, process.env.JWT_REFRESH_SECRET, async (err, user) => {
        if (err) {
            console.log(err);
            return res.sendStatus(401);
        }
        try {
            const userDb = await user_model_1.default.findOne({ '_id': user._id });
            if (!userDb.refreshTokens || !userDb.refreshTokens.includes(refreshToken)) {
                userDb.refreshTokens = [];
                await userDb.save();
                return res.sendStatus(401);
            }
            const accessToken = jsonwebtoken_1.default.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRATION });
            const newRefreshToken = jsonwebtoken_1.default.sign({ _id: user._id }, process.env.JWT_REFRESH_SECRET);
            userDb.refreshTokens = userDb.refreshTokens.filter(t => t !== refreshToken);
            userDb.refreshTokens.push(newRefreshToken);
            await userDb.save();
            res.cookie("refresh", newRefreshToken, {
                httpOnly: true,
                path: "/auth",
            });
            res.cookie("access", accessToken, {
                httpOnly: true,
                maxAge: accessTokenExpiration,
            });
            return res.status(200).send({
                'accessToken': accessToken,
                'refreshToken': newRefreshToken
            });
        }
        catch (err) {
            return res.status(401).send(err.message);
        }
    });
};
exports.default = {
    googleSignin,
    register,
    login,
    logout,
    refresh
};
//# sourceMappingURL=auth_controller.js.map