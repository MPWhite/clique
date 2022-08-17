import express from "express";
import { PrismaClient } from "@prisma/client";
import { logger } from "./src/util/logging";
import { createLogger } from "bunyan";
import { allRoutes } from "./src/allRoutes";
import bodyParser from "body-parser";
import postRoutes from "./src/postRoutes";
import { verifyToken } from "./src/middleware/auth";
import authRoutes from "./src/authRoutes";
import inviteRoutes from "./src/inviteRoutes";

const prisma = new PrismaClient();
const app = express();

// const requestLogger = createLogger({
//   name: "clique-http",
// });
//
// app.use(
//   bunyanMiddleware({
//     headerName: "X-Request-Id",
//     propertyName: "reqId",
//     logName: "req_id",
//     obscureHeaders: [],
//     logger: logger,
//   })
// );

app.use(bodyParser.json());

// app.use((err, req, res, next) => {
//   console.log(err);
//   next(err);
// });

app.use("/api", allRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/posts", verifyToken, postRoutes);
app.use("/api/invitation", verifyToken, inviteRoutes);

// app.get("/users", async (req, res) => {
//   const users = await prisma.user.findManm();
//   res.json(users);
// });

app.listen(3001);
