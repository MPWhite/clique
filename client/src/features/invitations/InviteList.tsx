import "./InviteList.scss";
import { get } from "psl";
import { extractHostname } from "../postFeed/PostFeed";
import { Link, useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";

const inviteList = [
  {
    id: "bc73ab1b-1c07-4194-826d-5bda2e50e791",
    serverId: "9f3f6848-4401-4660-b764-452ac4e3624b",
    creatorId: "7ce61ae3-2f72-4080-b145-1f40ea7abdb3",
    inviteUserDisplayName: "John Doe",
    socialProofLink: "https://www.linkedin.com/in/fdjskl",
    code: "SL7X",
    status: "PENDING",
    createdAt: "2022-08-20T19:00:47.017Z",
    creator: {
      displayName: "Matt",
    },
  },
  {
    id: "bc73ab1b-1c07-4194-826d-5bda2e50e791",
    serverId: "9f3f6848-4401-4660-b764-452ac4e3624b",
    creatorId: "7ce61ae3-2f72-4080-b145-1f40ea7abdb3",
    inviteUserDisplayName: "John Doe",
    socialProofLink: "https://www.linkedin.com/in/fdjskl",
    code: "SL7X",
    status: "PENDING",
    createdAt: "2022-08-20T19:00:47.017Z",
    creator: {
      displayName: "Matt",
    },
  },
];

function ApprovedInvite({ invite }: any) {
  return (
    <div className="Invite">
      {/*Name*/}
      <div className="Invite__Name">
        <p>{invite.inviteUserDisplayName}</p>
      </div>
      {/*Info*/}
      <div className="Invite__Info">
        <span>Proposed By: {invite.creator.displayName}</span>
        <span>•</span>
        <span>Approved By: Jane, Sam, Colby</span>
      </div>
      <div className="Invite__RegistrationLink">
        <span>Registration Link:</span>
        <span className={"SlightBold NonLinkUrl"}>www.clique.io/r/FJEC</span>
      </div>
    </div>
  );
}

function ProposedInvite({ invite, approveInvite }: any) {
  const domain = get(extractHostname(invite.socialProofLink));

  return (
    <div className="Invite">
      {/*Name*/}
      <div className="Invite__Name">
        <p>
          {invite.firstName} {invite.lastName}
        </p>
      </div>
      {/*Info*/}
      <div className="Invite__Info">
        <span>Proposed By: {invite.creator.displayName}</span>
        <span>•</span>
        {invite.Approvals.length > 0 ? (
          <>
            <span>
              Approved By:{" "}
              {invite.Approvals.map((a: any) => a.approver.displayName).join(
                ","
              )}
            </span>
            <span>•</span>
          </>
        ) : (
          <></>
        )}
        <span className="SocialProof">
          <a href={invite.socialProofLink}>Social Proof</a>{" "}
          <span>({domain})</span>
        </span>
      </div>
      {/*Actions*/}
      <div className="InviteActions">
        <button
          disabled={true}
          onClick={() => {
            approveInvite(invite.id);
          }}
        >
          Approve
        </button>
      </div>
    </div>
  );
}

export function InviteList() {
  const [invites, setInvites] = useState([]);
  const navigate = useNavigate();
  const authToken = localStorage.getItem("AUTH");

  const fetchInvites = () => {
    if (!authToken) {
      navigate("/login");
    }
    fetch(`/api/invitation?statusList=PENDING`, {
      // @ts-ignore
      headers: {
        Authorization: authToken,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setInvites(data);
      })
      .catch((err) => {
        alert("Oh no!");
        console.log(err.message);
      });
  };

  const approveInvite = (inviteId: string) => {
    if (!authToken) {
      navigate("/login");
    }
    fetch(`/api/invitation/${inviteId}/approve`, {
      method: "POST",
      // @ts-ignore
      headers: {
        Authorization: authToken,
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        serverId: "9f3f6848-4401-4660-b764-452ac4e3624b",
      }),
    }).catch((err) => {
      alert("Oh no!");
      console.log(err.message);
    });
  };

  useEffect(() => {
    fetchInvites();
  }, []);

  return (
    <>
      <div className="NavButton">
        <Link to={"/"}>
          <button>Feed</button>
        </Link>
      </div>
      <div className="InviteList">
        <h1>Invitations</h1>
        <div className="InviteList__Limits">
          <p>
            Your seniority in the clique impacts how many invitations you can
            send, and how many votes you can cast each week.
          </p>
          <div className="Limit">
            <div className="Limit__Label">Invitations remaining:</div>
            <span>0</span>
          </div>
          <div className="Limit">
            <div className="Limit__Label">Votes remaining:</div>
            <span>0</span>
          </div>
          <div className="Limit">
            <div className="Limit__Label">Limit resets in:</div>
            <span>2 days</span>
          </div>
        </div>
        <h2>Proposed Invites</h2>
        {/* TODO Write this copy */}
        <p>
          Invitations will show up as pending until they receive at least 2
          votes and are not vetoed. Once approved, invitations will contain a
          registration link which can be sent to the invited user and used to
          register an account in this clique.
        </p>
        {invites.map((invite) => (
          <ProposedInvite invite={invite} approveInvite={approveInvite} />
        ))}
        {/*<button className="InviteButton">Propose Invitation</button>*/}
        {/*TODO -- figure out how to name this*/}
        <h2>Approved Invites</h2>
        {/* TODO Write this copy */}
        <p>
          The following invites have been approved by the clique, but have not
          yet been redeemed. Please send them the registration link.
        </p>
        {inviteList.map((invite) => (
          <ApprovedInvite invite={invite} approveInvite={approveInvite} />
        ))}
      </div>
    </>
  );
}
