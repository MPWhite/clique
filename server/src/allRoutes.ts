import express from "express";
import bodyParser from "body-parser";
import { Validator, AllowedSchema } from "express-json-validator-middleware";
import { PostReq } from "./routeTypes";

export const allRoutes = express.Router();

type RenderedValidatorSchema = {
  $ref: string;
  $schema: string;
  definitions: Record<string, AllowedSchema>;
};

const PostReqJsonSchema: RenderedValidatorSchema = {
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

allRoutes.get("/users", async (req, res) => {
  res.json({ key: 1 });
});

const { validate } = new Validator({});

export interface TypedRequest<T> extends express.Request {
  body: T;
}

export interface AuthedRequest<T> extends express.Request {
  body: T;
  userId?: string;
}

interface TypedResponse<T> extends express.Response {}

allRoutes.post(
  "/test",
  validate({ body: PostReqJsonSchema.definitions.PostReq }),
  async (req: TypedRequest<PostReq>, res) => {
    res.json(req.body);
  }
);

export default {
  allRoutes,
};
