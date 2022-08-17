"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const db_1 = require("./db");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const authRoutes = express_1.default.Router();
authRoutes.post("/login", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, password } = req.body;
        const prisma = (0, db_1.getPrisma)();
        const user = yield prisma.user.findFirst({
            where: {
                displayName: username,
            },
        });
        if (!user) {
            res.status(404).send();
            return;
        }
        // @ts-ignore
        const passwordMatch = bcrypt_1.default.compareSync(password, user.password);
        if (!passwordMatch) {
            res.status(404).send();
            return;
        }
        const authToken = jsonwebtoken_1.default.sign(user.id, "REPLACE_ME");
        res.json({
            authToken,
        });
    }
    catch (ex) {
        console.error(ex);
        res.json("No good, sorry");
    }
}));
authRoutes.post("/register", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password, inviteToken } = req.body;
    const prisma = (0, db_1.getPrisma)();
    const user = yield prisma.user.findFirst({
        where: {
            displayName: username,
        },
    });
    if (user) {
        res.json("No!");
    }
    const hashedPassword = bcrypt_1.default.hashSync(password, 10);
    const insertedUser = yield prisma.user.create({
        data: {
            displayName: username,
            password: hashedPassword,
        },
    });
    const authToken = jsonwebtoken_1.default.sign(insertedUser.id, "REPLACE_ME");
    res.json({
        authToken,
    });
}));
exports.default = authRoutes;
