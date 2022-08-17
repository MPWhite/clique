"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = void 0;
const bunyan_1 = require("bunyan");
const logger = (0, bunyan_1.createLogger)({
    name: "Some Name"
});
exports.logger = logger;
