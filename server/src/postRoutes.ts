import express, { Request, Response } from "express";
import { getPrisma } from "./db";
import tracer from "../tracer";

const postRoutes = express.Router();

postRoutes.post("/", async (req, res) => {
  const post: {
    serverId: string;
    link: string;
    title: string;
  } = req.body;
  const db = getPrisma();
  await db.post.create({
    data: {
      serverId: post.serverId,
      authorId: res.locals.userId,
      link: post.link,
      title: post.title,
    },
  });

  res.json(post);
});

postRoutes.post("/:postId/comment", async (req: any, res) => {
  const prisma = getPrisma();
  const { parentCommentId, body } = req.body;
  const bodyOrDefault = body;

  const post = await prisma.post.findFirst({
    where: { id: req.params["postId"] },
    select: {
      serverId: true,
    },
  });
  if (!post?.serverId) {
    throw Error("Missing post");
  }
  if (parentCommentId) {
    const parentComment = await prisma.comment.findFirst({
      where: { id: parentCommentId },
    });
    if (!parentComment) {
      throw Error("Missing parent comment");
    }
  }

  // @ts-ignore
  await prisma.comment.create({
    data: {
      serverId: post.serverId,
      body: bodyOrDefault,
      authorId: res.locals.userId,
      postId: req.params["postId"],
      parentId: parentCommentId,
    },
  });

  res.json({ hello: "world" });
});

postRoutes.get("/", async (req: Request, res: Response) => {
  const prisma = getPrisma();
  const posts = await prisma.post.findMany({
    orderBy: { createdAt: "desc" },
    // @ts-ignore
    include: { author: true, _count: { select: { Comments: true } } },
  });
  res.json(posts);
});

postRoutes.get("/:postId", async (req, res) => {
  const prisma = getPrisma();
  let post: any;
  await tracer.trace("fetchPosts.db", async (span) => {
    post = await prisma.post.findFirst({
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
  });

  tracer.trace("fetchPosts.assembleComments", (span) => {
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
    formattedComments.sort((a: any, b: any) => {
      return Date.parse(b?.createdAt) - Date.parse(a?.createdAt);
    });

    // @ts-ignore
    post.Comments = formattedComments;
  });

  res.json(post);
});

postRoutes.get("/:postId/comment/:commentId", async (req, res) => {
  const prisma = getPrisma();
  const post = await prisma.post.findFirst({
    where: { id: req.params["postId"] },
  });
  const comment = await prisma.comment.findFirst({
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
});

export default postRoutes;
