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
const postRoutes = express_1.default.Router();
// id
// serverId
// authorId
// link
// title
// score
// createdAt
// updatedAt
postRoutes.post("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const post = req.body;
    const db = (0, db_1.getPrisma)();
    yield db.post.create({
        data: {
            serverId: post.serverId,
            authorId: post.authorId,
            link: post.link,
            title: post.title,
        },
    });
    res.json(post);
}));
postRoutes.post("/:postId/comment", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const prisma = (0, db_1.getPrisma)();
    const { parentCommentId, body } = req.body;
    const bodyOrDefault = body;
    const post = yield prisma.post.findFirst({
        where: { id: req.params["postId"] },
        select: {
            serverId: true,
        },
    });
    if (!(post === null || post === void 0 ? void 0 : post.serverId)) {
        throw Error("Missing post");
    }
    if (parentCommentId) {
        const parentComment = yield prisma.comment.findFirst({
            where: { id: parentCommentId },
        });
        if (!parentComment) {
            throw Error("Missing parent comment");
        }
    }
    // @ts-ignore
    yield prisma.comment.create({
        data: {
            serverId: post.serverId,
            // @ts-ignore
            body: bodyOrDefault,
            // @ts-ignore
            authorId: req.user,
            postId: req.params["postId"],
            parentId: parentCommentId,
        },
    });
    res.json({ hello: "world" });
}));
postRoutes.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const prisma = (0, db_1.getPrisma)();
    const posts = yield prisma.post.findMany({
        orderBy: { createdAt: "desc" },
        // @ts-ignore
        include: { author: true, _count: { select: { Comments: true } } },
    });
    res.json(posts);
}));
postRoutes.get("/:postId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const prisma = (0, db_1.getPrisma)();
    const post = yield prisma.post.findFirst({
        where: { id: req.params["postId"] },
        include: {
            author: true,
            // @ts-ignore
            Comments: {
                include: {
                    author: true,
                },
            },
        },
        orderBy: { createdAt: "desc" },
    });
    const commentsById = {};
    // @ts-ignore
    post.Comments.forEach((comment) => {
        // @ts-ignore
        comment.children = [];
        commentsById[comment.id] = comment;
    });
    // @ts-ignore
    post.Comments.forEach((comment) => {
        if (comment.parentId) {
            console.log(commentsById[comment.parentId]);
            commentsById[comment.parentId].children.push(comment);
        }
    });
    const formattedComments = [];
    // @ts-ignore
    post.Comments.forEach((comment) => {
        if (!comment.parentId) {
            // @ts-ignore
            formattedComments.push(commentsById[comment.id]);
        }
    });
    // @ts-ignore
    formattedComments.sort((a, b) => {
        return Date.parse(b === null || b === void 0 ? void 0 : b.createdAt) - Date.parse(a === null || a === void 0 ? void 0 : a.createdAt);
    });
    // @ts-ignore
    post.Comments = formattedComments;
    res.json(post);
}));
postRoutes.get("/:postId/comment/:commentId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const prisma = (0, db_1.getPrisma)();
    const post = yield prisma.post.findFirst({
        where: { id: req.params["postId"] },
    });
    const comment = yield prisma.comment.findFirst({
        where: { id: req.params["commentId"] },
        include: {
            author: true,
        },
    });
    if (!comment || !post || comment.postId !== post.id) {
        throw Error("AhhH!");
    }
    res.json({
        post,
        comment,
    });
}));
exports.default = postRoutes;
