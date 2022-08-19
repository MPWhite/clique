import express, { Request } from "express";
require("express-async-errors");
import { getPrisma } from "./db";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { TypedRequest } from "./allRoutes";
import { body, validationResult } from "express-validator";
import { logger } from "./util/logging";

const authRoutes = express.Router();

type LoginRequest = {
  username: string;
  password: string;
};

authRoutes.post(
  "/login",
  [body("username").exists(), body("password").exists()],
  async (req: TypedRequest<LoginRequest>, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json(errors).send();
    }
    const { username, password } = req.body;
    const prisma = getPrisma();
    const user = await prisma.user.findFirst({
      where: {
        displayName: username,
      },
    });

    if (!user) {
      res.status(404).json("User not found");
      return;
    }

    const passwordMatch = bcrypt.compareSync(password, user.password);
    if (!passwordMatch) {
      res.status(401).json("Bad password").send();
      return;
    }

    const authToken = jwt.sign(user.id, "REPLACE_ME");

    res.json({
      authToken,
    });
  }
);

// TODO this needs to be a transaction
authRoutes.post(
  "/register",
  [
    body("serverId").exists(),
    body("username").exists(),
    body("password").exists(),
    body("inviteId").exists(),
  ],
  async (req, res) => {
    // Request validation
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json(errors).send();
    }
    // Start the actual request handler
    const { username, password, inviteId } = req.body;
    const prisma = getPrisma();

    const invitation = await prisma.invitation.findFirst({
      where: {
        id: inviteId,
      },
    });

    if (!invitation) {
      res.status(404).json("Invitation not found").send();
      return;
    }
    if (invitation.status != "ACCEPTED") {
      res.status(400).json("Invitation not accepted").send();
      return;
    }

    const hashedPassword = bcrypt.hashSync(password, 10);
    const insertedUser = await prisma.user.create({
      data: {
        displayName: username,
        password: hashedPassword,
        invitationId: inviteId,
      },
    });

    await prisma.invitation.update({
      where: {
        id: inviteId,
      },
      data: {
        // @ts-ignore
        status: "USED",
      },
    });

    const authToken = jwt.sign(insertedUser.id, "REPLACE_ME");
    res.json({
      authToken,
    });
  }
);

export default authRoutes;
