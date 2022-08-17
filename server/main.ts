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
import bunyanMiddleware from "bunyan-middleware";

const prisma = new PrismaClient();
const app = express();

const requestLogger = createLogger({
  name: "clique-http",
});

app.use(
  bunyanMiddleware({
    headerName: "X-Request-Id",
    propertyName: "reqId",
    logName: "req_id",
    obscureHeaders: [],
    logger: logger,
  })
);

app.use(bodyParser.json());

// app.use((err, req, res, next) => {
//   console.log(err);
//   next(err);
// });

app.use("/api", allRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/posts", verifyToken, postRoutes);
app.use("/api/invitation", verifyToken, inviteRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

app.listen(3001);
