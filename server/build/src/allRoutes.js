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
exports.allRoutes = void 0;
const express_1 = __importDefault(require("express"));
const express_json_validator_middleware_1 = require("express-json-validator-middleware");
exports.allRoutes = express_1.default.Router();
const PostReqJsonSchema = {
    $ref: "#/definitions/PostReq",
    $schema: "http://json-schema.org/draft-07/schema#",
    definitions: {
        PostReq: {
            additionalProperties: false,
            properties: {
                someKey: {
                    enum: ["val1", "val2"],
                    type: "string",
                },
            },
            required: ["someKey"],
            type: "object",
        },
    },
};
exports.allRoutes.get("/users", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.json({ key: 1 });
}));
const { validate } = new express_json_validator_middleware_1.Validator({});
exports.allRoutes.post("/test", validate({ body: PostReqJsonSchema.definitions.PostReq }), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.json(req.body);
}));
exports.default = {
    allRoutes: exports.allRoutes,
};
