import "./tracer";
import express, { Request, Response, NextFunction } from "express";
import { logger } from "./src/util/logging";
import { allRoutes } from "./src/allRoutes";
import bodyParser from "body-parser";
import postRoutes from "./src/postRoutes";
import authRoutes from "./src/authRoutes";
import inviteRoutes from "./src/inviteRoutes";
import bunyanMiddleware from "bunyan-middleware";
import { verifyToken } from "./src/middleware/auth";
import connectDatadog from "connect-datadog";

const app = express();
console.log("Setting up request logging");
// app.use(
//   bunyanMiddleware({
//     headerName: "X-Request-Id",
//     propertyName: "reqId",
//     logName: "req_id",
//     obscureHeaders: [],
//     logger: logger,
//   })
// );

const ddOptions = {
  response_code: true,
  tags: ["app:clique-be"],
};

app.use(bodyParser.json());
// app.use(connectDatadog(ddOptions));

app.use("/api", allRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/posts", verifyToken, postRoutes);
app.use("/api/invitation", verifyToken, inviteRoutes);

console.log(`Listening on port ${process.env.PORT || 3001}`);
app.listen(process.env.PORT || 3001);
