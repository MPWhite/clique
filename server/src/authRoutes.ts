import express from "express";
import { getPrisma } from "./db";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const authRoutes = express.Router();

authRoutes.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    const prisma = getPrisma();

    const user = await prisma.user.findFirst({
      where: {
        displayName: username,
      },
    });

    if (!user) {
      res.status(404).send();
      return;
    }

    // @ts-ignore
    const passwordMatch = bcrypt.compareSync(password, user.password);
    if (!passwordMatch) {
      res.status(404).send();
      return;
    }

    const authToken = jwt.sign(user.id, "REPLACE_ME");

    res.json({
      authToken,
    });
  } catch (ex) {
    console.error(ex);
    res.json("No good, sorry");
  }
});

authRoutes.post("/register", async (req, res) => {
  const { username, password, inviteToken } = req.body;
  const prisma = getPrisma();

  const user = await prisma.user.findFirst({
    where: {
      displayName: username,
    },
  });

  if (user) {
    res.json("No!");
  }

  const hashedPassword = bcrypt.hashSync(password, 10);

  const insertedUser = await prisma.user.create({
    data: {
      displayName: username,
      password: hashedPassword,
    },
  });

  const authToken = jwt.sign(insertedUser.id, "REPLACE_ME");

  res.json({
    authToken,
  });
});

export default authRoutes;
