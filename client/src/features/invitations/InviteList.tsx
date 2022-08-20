import "./InviteList.scss";
import { get } from "psl";
import { extractHostname } from "../postFeed/PostFeed";
import { Link } from "react-router-dom";
import React from "react";

const inviteList = [
  {
    id: "bc73ab1b-1c07-4194-826d-5bda2e50e791",
    serverId: "9f3f6848-4401-4660-b764-452ac4e3624b",
    creatorId: "7ce61ae3-2f72-4080-b145-1f40ea7abdb3",
    inviteUserDisplayName: "ReidWilliamson",
    socialProofLink: "https://www.linkedin.com/in/reid-williamson-6812b362/",
    code: "SL7X",
    status: "PENDING",
    createdAt: "2022-08-20T19:00:47.017Z",
    creator: {
      displayName: "Matt",
    },
  },
];

const invite = {
  id: "bc73ab1b-1c07-4194-826d-5bda2e50e791",
  serverId: "9f3f6848-4401-4660-b764-452ac4e3624b",
  creatorId: "7ce61ae3-2f72-4080-b145-1f40ea7abdb3",
  inviteUserDisplayName: "ReidWilliamson",
  socialProofLink: "https://www.linkedin.com/in/reid-williamson-6812b362/",
  code: "SL7X",
  status: "PENDING",
  createdAt: "2022-08-20T19:00:47.017Z",
  creator: {
    displayName: "Matt",
  },
};

function Invite({ invite }: { invite: any }) {
  const domain = get(extractHostname(invite.socialProofLink));

  return (
    <div className="PendingInvite">
      {/*Name*/}
      <div className="PendingInvite__Name">
        <p>Reid Williamson</p>
      </div>
      {/*Info*/}
      <div className="PendingInvite__Info">
        <span>Proposed By: {invite.creator.displayName}</span>
        <span>•</span>
        <span>Approved By: Paul</span>
        <span>•</span>
        <span className="SocialProof">
          <a href={invite.socialProofLink}>Social Proof</a>{" "}
          <span>({domain})</span>
        </span>
      </div>
      {/*Actions*/}
      <div className="InviteActions">
        <button>Approve</button>
        <button>Veto</button>
      </div>
    </div>
  );
}

export function InviteList() {
  return (
    <>
      <div className="NavButton">
        <Link to={"/"}>
          <button>Feed</button>
        </Link>
      </div>
      <div className="InviteList">
        <h1>Invitations</h1>
        <span>Votes remaining: 2</span>
        <span>Invitations remaining: 1</span>
        <span>Quota resets in: 4hours</span>
        <h2>Pending Invites</h2>
        <p>
          Invitations will show up as pending until they receive at least 2
          votes and are not vetoed. Once approved, invitations will contain a
          registration link which can be sent to the invited user and used to
          register an account in this clique.
        </p>
        {inviteList.map((invite) => (
          <Invite invite={invite} />
        ))}
      </div>
    </>
  );
}
