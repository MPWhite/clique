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
const express_validator_1 = require("express-validator");
const logging_1 = require("./util/logging");
const authRoutes = express_1.default.Router();
const loginValidators = [
    (0, express_validator_1.body)("username").exists().isLength({ min: 0, max: 100 }),
    (0, express_validator_1.body)("password").exists().isLength({ min: 3, max: 100 }),
];
// const loginValidator = (req, res, next) => {
//   body("username").exists().isLength({ min: 0, max: 100 });
//   const errors = validationResult(req);
//   if (!errors.isEmpty()) {
//     res.error(errors);
//   } else {
//     next();
//   }
// };
//
authRoutes.post("/login", loginValidators, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        res.status(400).json(errors).send();
    }
    const { username, password } = req.body;
    const prisma = (0, db_1.getPrisma)();
    const user = yield prisma.user.findFirst({
        where: {
            displayName: username,
        },
    });
    logging_1.logger.info(user === null || user === void 0 ? void 0 : user.id);
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
