"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseController = void 0;
class BaseController {
    constructor(model) {
        this.model = model;
    }
    async get(req, res) {
        try {
            const objects = await this.model.find();
            res.send(objects);
        }
        catch (err) {
            res.status(500).json({ message: err.message });
        }
    }
    async getById(req, res) {
        try {
            const obj = await this.model.findById(req.params.id);
            res.send(obj);
        }
        catch (err) {
            res.status(500).json({ message: err.message });
        }
    }
    async post(req, res) {
        try {
            const obj = await this.model.create(req.body);
            res.status(201).send(obj);
        }
        catch (err) {
            res.status(406).send("fail: " + err.message);
        }
    }
    async putById(req, res) {
        try {
            const obj = await this.model.findByIdAndUpdate(req.params.id, req.body);
            res.status(200).send(obj);
        }
        catch (err) {
            res.status(500).json({ message: err.message });
        }
    }
    async deleteById(req, res) {
        try {
            const obj = await this.model.findByIdAndDelete(req.params.id);
            res.status(200).send(obj);
        }
        catch (err) {
            res.status(500).json({ message: err.message });
        }
    }
}
exports.BaseController = BaseController;
const createController = (model) => {
    return new BaseController(model);
};
exports.default = createController;
//# sourceMappingURL=base_controller.js.map