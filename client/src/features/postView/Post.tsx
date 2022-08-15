import "./Post.scss";
import { DummyPost } from "../postFeed/PostFeed";
import React, { useEffect, useState } from "react";
import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en.json";

TimeAgo.addDefaultLocale(en);

// Create formatter (English).
const timeAgo = new TimeAgo("en-US");

export function Comment({ comment }: { comment: any }) {
  return (
    <div className="Comment">
      <div className="Comment__Metadata">
        <span>{comment.author.displayName}</span>
        <span>{timeAgo.format(Date.parse(comment.createdAt))}</span>
      </div>
      <span>{comment.body}</span>
      <a className="Comment__Reply" href="/">
        Reply
      </a>
      <div className="Comment__Children">
        {comment.children &&
          // @ts-ignore
          comment.children.map((child) => {
            return <Comment comment={child} />;
          })}
      </div>
    </div>
  );
}

const TOKEN =
  "eyJhbGciOiJIUzI1NiJ9.N2NlNjFhZTMtMmY3Mi00MDgwLWIxNDUtMWY0MGVhN2FiZGIz.lrk6fs9aH13PEBS_n4rRyKziAH4Sdj7YbRDg-ChTPJ8";

export function Post() {
  const [postWithComments, setPostWithComments] = useState(null);

  useEffect(() => {
    fetch("/api/posts/6a50ad89-361b-4482-841d-ce5baf9c7753", {
      headers: {
        Authorization: TOKEN,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setPostWithComments(data);
      })
      .catch((err) => {
        alert("oh no!");
        console.log(err.message);
      });
  }, []);

  return (
    <div className="Post">
      <div className="PostCard">
        <div className="PostCard__Details">
          {/*@ts-ignore*/}
          <p>{postWithComments?.title}</p>
          <span>
            {/*@ts-ignore*/}
            {postWithComments?.createdAt &&
              // @ts-ignore
              timeAgo.format(Date.parse(postWithComments.createdAt))}
          </span>
          {/*@ts-ignore*/}
          <span>{postWithComments?.author?.displayName}</span>
        </div>
      </div>

      <div className="Post__Reply">
        <textarea></textarea>
        <button>Reply</button>
      </div>

      <div className="Comments">
        <h3>Comments</h3>
        {postWithComments &&
          // @ts-ignore
          postWithComments.Comments.map((comment) => {
            return <Comment comment={comment} />;
          })}
      </div>
    </div>
  );
}
