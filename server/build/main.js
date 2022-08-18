"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const logging_1 = require("./src/util/logging");
const allRoutes_1 = require("./src/allRoutes");
const body_parser_1 = __importDefault(require("body-parser"));
const postRoutes_1 = __importDefault(require("./src/postRoutes"));
const authRoutes_1 = __importDefault(require("./src/authRoutes"));
const inviteRoutes_1 = __importDefault(require("./src/inviteRoutes"));
const bunyan_middleware_1 = __importDefault(require("bunyan-middleware"));
const auth_1 = require("./src/middleware/auth");
const connect_datadog_1 = __importDefault(require("connect-datadog"));
const app = (0, express_1.default)();
console.log("Setting up request logging");
app.use((0, bunyan_middleware_1.default)({
    headerName: "X-Request-Id",
    propertyName: "reqId",
    logName: "req_id",
    obscureHeaders: [],
    logger: logging_1.logger,
}));
const ddOptions = {
    response_code: true,
    tags: ["app:clique-be"],
};
app.use(body_parser_1.default.json());
app.use((0, connect_datadog_1.default)(ddOptions));
app.use("/api", allRoutes_1.allRoutes);
app.use("/api/auth", authRoutes_1.default);
app.use("/api/posts", auth_1.verifyToken, postRoutes_1.default);
app.use("/api/invitation", auth_1.verifyToken, inviteRoutes_1.default);
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send("Something broke!");
});
console.log(`Listening on port ${process.env.PORT || 3001}`);
app.listen(process.env.PORT || 3001);
