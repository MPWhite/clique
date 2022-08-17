import express from "express";
import { logger } from "./src/util/logging";
import { allRoutes } from "./src/allRoutes";
import bodyParser from "body-parser";
import postRoutes from "./src/postRoutes";
import authRoutes from "./src/authRoutes";
import inviteRoutes from "./src/inviteRoutes";
import bunyanMiddleware from "bunyan-middleware";

const app = express();

console.log("Setting up request logging");
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

app.use("/api", allRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/invitation", inviteRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

console.log(`Listening on port ${process.env.PORT || 3001}`);
app.listen(process.env.PORT || 3001);
