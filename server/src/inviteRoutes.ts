import { Router, Request, Response } from "express";
import { getPrisma } from "./db";

const inviteRoutes = Router();

inviteRoutes.post("/", async (req: Request, res: Response) => {
  const { serverId, firstName, lastName, socialProofLink } = req.body;
  const prisma = getPrisma();

  // TODO -- need to check that the user is allowed to create an invite

  const code = "TODO-REPLACE-ME";

  prisma.invitation.create({
    data: {
      // What the fuck is this syntax? How could this possibly work?
      server: serverId,
      // @ts-ignore
      creator: req.user,
      inviteUserDisplayName: `${firstName}${lastName}`,
      socialProofLink,
      code,
      status: "PENDING",
    },
  });

  res.json({
    code,
  });
});

inviteRoutes.get("/", async (req: Request, res: Response) => {
  const prisma = getPrisma();

  const actionableInvites = prisma.invitation.findMany({
    where: {
      status: "PENDING",
    },
  });

  res.json();
});

inviteRoutes.get("/personal", async (req: Request, res: Response) => {
  const prisma = getPrisma();
});

export default inviteRoutes;
