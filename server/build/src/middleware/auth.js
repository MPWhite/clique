"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config = process.env;
const verifyToken = (req, res, next) => {
    const token = req.headers["authorization"];
    if (!token) {
        return res.status(403).send("Authorization token missing");
    }
    try {
        req.userId = jsonwebtoken_1.default.verify(token, "REPLACE_ME");
    }
    catch (err) {
        return res.status(401).send("Invalid token");
    }
    return next();
};
exports.verifyToken = verifyToken;
