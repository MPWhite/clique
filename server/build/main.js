"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const client_1 = require("@prisma/client");
const allRoutes_1 = require("./src/allRoutes");
const body_parser_1 = __importDefault(require("body-parser"));
const postRoutes_1 = __importDefault(require("./src/postRoutes"));
const auth_1 = require("./src/middleware/auth");
const authRoutes_1 = __importDefault(require("./src/authRoutes"));
const inviteRoutes_1 = __importDefault(require("./src/inviteRoutes"));
const prisma = new client_1.PrismaClient();
const app = (0, express_1.default)();
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
app.use(body_parser_1.default.json());
// app.use((err, req, res, next) => {
//   console.log(err);
//   next(err);
// });
app.use("/api", allRoutes_1.allRoutes);
app.use("/api/auth", authRoutes_1.default);
app.use("/api/posts", auth_1.verifyToken, postRoutes_1.default);
app.use("/api/invitation", auth_1.verifyToken, inviteRoutes_1.default);
// app.get("/users", async (req, res) => {
//   const users = await prisma.user.findManm();
//   res.json(users);
// });
app.listen(3001);
