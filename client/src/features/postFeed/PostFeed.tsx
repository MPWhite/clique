import React, { useEffect, useState } from "react";
import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en.json";

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
        <span>4 comments</span>
      </div>
    </div>
  );
}

const TOKEN =
  "eyJhbGciOiJIUzI1NiJ9.N2NlNjFhZTMtMmY3Mi00MDgwLWIxNDUtMWY0MGVhN2FiZGIz.lrk6fs9aH13PEBS_n4rRyKziAH4Sdj7YbRDg-ChTPJ8";

export function PostFeed() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    fetch("/api/posts", {
      headers: {
        Authorization: TOKEN,
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

  console.log(posts);

  return (
    <div className="App">
      <button>Post Something</button>
      <button>Edit Account</button>
      <button>Invite Somebody</button>
      {posts.map((post, idx) => {
        return <DummyPost rank={idx + 1} post={post} />;
      })}
    </div>
  );
}
