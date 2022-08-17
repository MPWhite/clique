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
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const db_1 = require("./db");
const inviteRoutes = (0, express_1.Router)();
inviteRoutes.post("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { serverId, firstName, lastName, socialProofLink } = req.body;
    const prisma = (0, db_1.getPrisma)();
    // TODO -- need to check that the user is allowed to create an invite
    const code = "TODO-REPLACE-ME";
    prisma.invitation.create({
        data: {
            // What the fuck is this syntax? How could this possibly work?
            server: serverId,
            // @ts-ignore
            creator: req.user,
            inviteUserDisplayName: `${firstName}${lastName}`,
            socialProofLink,
            code,
            status: "PENDING",
        },
    });
    res.json({
        code,
    });
}));
inviteRoutes.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const prisma = (0, db_1.getPrisma)();
    const actionableInvites = prisma.invitation.findMany({
        where: {
            status: "PENDING",
        },
    });
    res.json();
}));
inviteRoutes.get("/personal", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const prisma = (0, db_1.getPrisma)();
}));
exports.default = inviteRoutes;
