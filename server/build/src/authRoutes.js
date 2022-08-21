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
require("express-async-errors");
const db_1 = require("./db");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const express_validator_1 = require("express-validator");
const authRoutes = express_1.default.Router();
authRoutes.post("/login", [(0, express_validator_1.body)("username").exists(), (0, express_validator_1.body)("password").exists()], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
    if (!user) {
        res.status(404).json("User not found");
        return;
    }
    const passwordMatch = bcrypt_1.default.compareSync(password, user.password);
    if (!passwordMatch) {
        res.status(401).json("Bad password").send();
        return;
    }
    const authToken = jsonwebtoken_1.default.sign(user.id, "REPLACE_ME");
    res.json({
        authToken,
    });
}));
// TODO this needs to be a transaction
authRoutes.post("/register", [
    (0, express_validator_1.body)("serverId").exists(),
    (0, express_validator_1.body)("username").exists(),
    (0, express_validator_1.body)("password").exists(),
    (0, express_validator_1.body)("inviteId").exists(),
], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // Request validation
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        res.status(400).json(errors).send();
    }
    // Start the actual request handler
    const { username, password, inviteId } = req.body;
    const prisma = (0, db_1.getPrisma)();
    const invitation = yield prisma.invitation.findFirst({
        where: {
            id: inviteId,
        },
    });
    if (!invitation) {
        res.status(404).json("Invitation not found").send();
        return;
    }
    if (invitation.status != "ACCEPTED") {
        res.status(400).json("Invitation not accepted").send();
        return;
    }
    const hashedPassword = bcrypt_1.default.hashSync(password, 10);
    const insertedUser = yield prisma.user.create({
        data: {
            displayName: username,
            password: hashedPassword,
            invitationId: inviteId,
        },
    });
    yield prisma.invitation.update({
        where: {
            id: inviteId,
        },
        data: {
            // @ts-ignore
            status: "USED",
        },
    });
    const authToken = jsonwebtoken_1.default.sign(insertedUser.id, "REPLACE_ME");
    res.json({
        authToken,
    });
}));
exports.default = authRoutes;
