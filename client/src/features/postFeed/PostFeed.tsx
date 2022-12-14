import React, { useEffect, useState } from "react";
import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en.json";
import { Link } from "react-router-dom";
import PullToRefresh from "react-simple-pull-to-refresh";
import { useNavigate } from "react-router-dom";
import { get } from "psl";

TimeAgo.addDefaultLocale(en);

export function extractHostname(url: string) {
  var hostname;
  //find & remove protocol (http, ftp, etc.) and get hostname

  if (url.indexOf("//") > -1) {
    hostname = url.split("/")[2];
  } else {
    hostname = url.split("/")[0];
  }

  //find & remove port number
  hostname = hostname.split(":")[0];
  //find & remove "?"
  hostname = hostname.split("?")[0];

  return hostname;
}

// Create formatter (English).
const timeAgo = new TimeAgo("en-US");

export function DummyPost({ rank, post }: { rank: Number; post: any }) {
  const openLink = () => {
    window.open(post.link);
  };

  // @ts-ignore
  const domain = get(extractHostname(post.link));

  return (
    <div className="PostCard" onClick={openLink}>
      <div className="PostCard__Score">
        <span>{rank.toString()}</span>
      </div>
      <div className="PostCard__Details">
        <div>
          <p>{post.title}</p>
          {domain && <span>{domain.toString()}</span>}
        </div>
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
        {posts.map((post, idx) => {
          return <DummyPost rank={idx + 1} key={idx} post={post} />;
        })}
      </>
    </PullToRefresh>
  );
}
