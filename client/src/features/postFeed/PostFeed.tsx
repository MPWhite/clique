import React, { useEffect, useState } from "react";
import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en.json";
import { Link } from "react-router-dom";
import PullToRefresh from "react-simple-pull-to-refresh";
import { useNavigate } from "react-router-dom";

TimeAgo.addDefaultLocale(en);

// Create formatter (English).
const timeAgo = new TimeAgo("en-US");

export function DummyPost({ rank, post }: { rank: Number; post: any }) {
  const openLink = () => {
    window.open(post.link);
  };

  return (
    <div className="PostCard" onClick={openLink}>
      <div className="PostCard__Score">
        <span>{rank.toString()}</span>
      </div>
      <div className="PostCard__Details">
        <p>{post.title}</p>
        <span>{timeAgo.format(Date.parse(post.createdAt))}</span>
        <span>{post.author.displayName}</span>
        <span
          onClick={(event) => {
            event.preventDefault();
            event.stopPropagation();
          }}
        >
          <Link to={`/post/${post.id}`}>
            {post._count.Comments} Comment
            {post._count.Comments === 1 ? "" : "s"}
          </Link>
        </span>
      </div>
    </div>
  );
}

export function PostFeed() {
  const navigate = useNavigate();

  const [posts, setPosts] = useState([]);
  const authToken = localStorage.getItem("AUTH");

  const fetchPosts = async () => {
    const authToken = localStorage.getItem("AUTH");
    if (!authToken) {
      navigate("/login");
      return;
    }

    fetch("/api/posts", {
      // @ts-ignore
      headers: {
        Authorization: localStorage.getItem("AUTH"),
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setPosts(data);
      })
      .catch((err) => {
        console.log(err.message);
      });
  };

  useEffect(() => {
    if (!authToken) {
      navigate("/login");
      return;
    }
    fetch("/api/posts", {
      // @ts-ignore
      headers: {
        Authorization: localStorage.getItem("AUTH"),
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setPosts(data);
      })
      .catch((err) => {
        console.log(err.message);
      });
  }, []);

  return (
    <PullToRefresh
      onRefresh={async () => {
        await fetchPosts();
        return Promise.resolve(1);
      }}
      canFetchMore={true}
    >
      <>
        <div className="NavButton">
          <Link to={"/submit-post"}>
            <button>Post</button>
          </Link>
          <Link to={"/login"}>
            <button>Login</button>
          </Link>
          <button
            onClick={() => {
              localStorage.removeItem("AUTH");
              navigate("/login");
            }}
          >
            Logout
          </button>
        </div>
        {posts.map((post, idx) => {
          return <DummyPost rank={idx + 1} key={idx} post={post} />;
        })}
      </>
    </PullToRefresh>
  );
}
