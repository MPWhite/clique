import { Router, Request, Response } from "express";
import { getPrisma } from "./db";
import { AuthedRequest, TypedRequest } from "./allRoutes";
import { body, validationResult } from "express-validator";
import { logger } from "./util/logging";

const inviteRoutes = Router();

type CreateInviteRequest = {
  serverId: string;
  firstName: string;
  lastName: string;
  socialProofLink: string;
};

inviteRoutes.post(
  "/",
  [
    body("serverId").exists(),
    body("firstName").exists(),
    body("lastName").exists(),
    body("socialProofLink").exists(),
  ],
  async (req: AuthedRequest<CreateInviteRequest>, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json(errors).send();
      return;
    }
    const { serverId, firstName, lastName, socialProofLink } = req.body;
    const userId = req.userId;
    if (!userId) {
      res.status(401).json("No userId found on request").send();
      return;
    }
    const prisma = getPrisma();

    const code = Math.random().toString(36).slice(2, 6).toUpperCase();

    const invite = await prisma.invitation.create({
      data: {
        serverId,
        creatorId: userId,
        // @ts-ignore
        firstName,
        lastName,
        socialProofLink,
        code,
        status: "PENDING",
      },
    });

    res.json({
      code,
    });
  }
);

// TODO(!) this needs to be put into a transaction
inviteRoutes.post(
  "/:inviteId/approve",
  [body("serverId").exists()],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json(errors).send();
      return;
    }
    const prisma = getPrisma();
    const inviteId = req.params["inviteId"];
    const { serverId } = req.body;

    await prisma.approval.create({
      data: {
        invitationId: inviteId,
        serverId: serverId,
        approverId: req.userId,
      },
    });

    const approvals = await prisma.approval.findMany({
      where: {
        invitationId: inviteId,
      },
    });
    logger.info("FINDME: ", approvals);
    // TODO -- this should be configurable
    if (approvals.length > 1) {
      await prisma.invitation.update({
        where: {
          id: inviteId,
        },
        data: {
          status: "ACCEPTED",
        },
      });
    }
    res.json();
  }
);

type InvitationStatus = "PENDING" | "ACCEPTED" | "REJECTED" | "USED";

inviteRoutes.get("/", async (req: Request, res: Response) => {
  const prisma = getPrisma();
  const { statusList } = req.query;
  const statusListOrDefault = statusList || "PENDING";
  // TODO -- how to make these types work
  // @ts-ignore
  const formattedStatusList: Array<InvitationStatus> = statusListOrDefault
    .toString()
    .split(",");
  const validStatusList = ["PENDING", "ACCEPTED", "REJECTED", "USED"];
  formattedStatusList.forEach((status) => {
    if (!validStatusList.includes(status)) {
      res
        .status(400)
        .json(
          `Invalid status list: ${status}. Must be one of ${validStatusList}`
        )
        .send();
      return;
    }
  });

  logger.info("AHHH", statusList);

  const invites = await prisma.invitation.findMany({
    where: {
      status: {
        in: formattedStatusList,
      },
    },
    include: {
      creator: {
        select: {
          displayName: true,
        },
      },
      Approvals: {
        select: {
          approver: {
            select: {
              displayName: true,
            },
          },
        },
      },
    },
  });

  res.json(invites);
});

inviteRoutes.get("/limits", (req, res) => {
  res.json({
    invitationsRemaining: 0,
    approvalsRemaining: 0,
    vetoesRemaining: 0,
    limitResetTimestamp: 0,
  });
});

export default inviteRoutes;
