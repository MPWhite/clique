import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import "./HeaderNav.scss";
import React from "react";

export function HeaderNav() {
  const navigate = useNavigate();

  return (
    <div className="NavButton">
      <Link to={"/"}>
        <button className="active">Feed</button>
      </Link>
      <Link to={"/submit-post"}>
        <button>Post</button>
      </Link>
      <Link to={"/invites"}>
        <button>Invites</button>
      </Link>
      <button
        className="NavButton__Logout"
        onClick={() => {
          localStorage.removeItem("AUTH");
          navigate("/login");
        }}
      >
        Logout
      </button>
    </div>
  );
}
