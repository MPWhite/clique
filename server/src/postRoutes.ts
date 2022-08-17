import express from "express";
import { getPrisma } from "./db";

const postRoutes = express.Router();

// id
// serverId
// authorId
// link
// title
// score
// createdAt
// updatedAt

postRoutes.post("/", async (req, res) => {
  const post: {
    serverId: string;
    authorId: string;
    link: string;
    title: string;
  } = req.body;
  const db = getPrisma();
  await db.post.create({
    data: {
      serverId: post.serverId,
      authorId: post.authorId,
      link: post.link,
      title: post.title,
    },
  });

  res.json(post);
});

postRoutes.post("/:postId/comment", async (req, res) => {
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
      // @ts-ignore
      body: bodyOrDefault,
      // @ts-ignore
      authorId: req.user,
      postId: req.params["postId"],
      parentId: parentCommentId,
    },
  });

  res.json({ hello: "world" });
});

postRoutes.get("/", async (req, res) => {
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
  const post = await prisma.post.findFirst({
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
  formattedComments.sort((a: any, b: any) => {
    return Date.parse(b?.createdAt) - Date.parse(a?.createdAt);
  });

  // @ts-ignore
  post.Comments = formattedComments;

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
