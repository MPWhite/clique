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
const express_validator_1 = require("express-validator");
const logging_1 = require("./util/logging");
const inviteRoutes = (0, express_1.Router)();
inviteRoutes.post("/", [
    (0, express_validator_1.body)("serverId").exists(),
    (0, express_validator_1.body)("firstName").exists(),
    (0, express_validator_1.body)("lastName").exists(),
    (0, express_validator_1.body)("socialProofLink").exists(),
], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        res.status(400).json(errors).send();
        return;
    }
    const { serverId, firstName, lastName, socialProofLink } = req.body;
    const userId = req.userId;
    if (!userId) {
        res.status(401).json("No userId found on request").send();
        return;
    }
    const prisma = (0, db_1.getPrisma)();
    const code = Math.random().toString(36).slice(2, 6).toUpperCase();
    const invite = yield prisma.invitation.create({
        data: {
            serverId,
            creatorId: userId,
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
// TODO(!) this needs to be put into a transaction
inviteRoutes.post("/:inviteId/approve", [(0, express_validator_1.body)("serverId").exists()], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        res.status(400).json(errors).send();
        return;
    }
    const prisma = (0, db_1.getPrisma)();
    const inviteId = req.params["inviteId"];
    const { serverId } = req.body;
    yield prisma.approval.create({
        data: {
            invitationId: inviteId,
            serverId: serverId,
            approverId: req.userId,
        },
    });
    const approvals = yield prisma.approval.findMany({
        where: {
            invitationId: inviteId,
        },
    });
    logging_1.logger.info("FINDME: ", approvals);
    // TODO -- this should be configurable
    if (approvals.length > 1) {
        yield prisma.invitation.update({
            where: {
                id: inviteId,
            },
            data: {
                status: "ACCEPTED",
            },
        });
    }
    res.json();
}));
inviteRoutes.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const prisma = (0, db_1.getPrisma)();
    const invites = yield prisma.invitation.findMany({
        where: {
            status: "PENDING",
        },
    });
    res.json(invites);
}));
exports.default = inviteRoutes;
