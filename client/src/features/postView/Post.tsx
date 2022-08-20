import "./Post.scss";
import { DummyPost } from "../postFeed/PostFeed";
import React, { useEffect, useState } from "react";
import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en.json";
import { Field, Formik } from "formik";
import { Link, useNavigate, useParams } from "react-router-dom";
import { get } from "psl";

function extractHostname(url: string) {
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
      <Link
        to={`/post/${comment.postId}/comment/${comment.id}`}
        className="Comment__Reply"
      >
        Reply
      </Link>
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

export function Post() {
  const params = useParams();

  const [postWithComments, setPostWithComments] = useState(null);
  const navigate = useNavigate();
  const authToken = localStorage.getItem("AUTH");

  const openLink = () => {
    // @ts-ignore
    window.open(postWithComments.link);
  };

  const fetchComments = () => {
    if (!authToken) {
      navigate("/login");
      return;
    }
    fetch(`/api/posts/${params.postId}`, {
      headers: {
        Authorization: authToken,
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
  };

  useEffect(() => {
    fetchComments();
  }, []);

  let domain;
  // @ts-ignore
  if (postWithComments?.link) {
    // @ts-ignore
    domain = get(extractHostname(postWithComments.link));
  }

  return (
    <div className="Post">
      <div className="PostCard" onClick={openLink}>
        <div className="PostCard__Details">
          <div>
            {/*@ts-ignore*/}
            <p>{postWithComments?.title}</p>
            {domain && <span>{domain.toString()}</span>}
          </div>
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

      <Formik
        initialValues={{ commentBody: "" }}
        validate={(values) => {
          return [];
        }}
        onSubmit={async (values, { setSubmitting, resetForm }) => {
          setSubmitting(true);
          if (!authToken) {
            navigate("/login");
            return;
          }
          const commentBody = {
            // @ts-ignore
            serverId: postWithComments?.serverId,
            body: values.commentBody,
            parentId: undefined,
          };
          await fetch(`/api/posts/${params.postId}/comment`, {
            method: "POST",
            headers: {
              Authorization: authToken,
              "Content-Type": "application/json",
            },
            // @ts-ignore
            body: JSON.stringify(commentBody),
          });
          resetForm();
          setSubmitting(false);
          fetchComments();
        }}
      >
        {({
          values,
          errors,
          touched,
          handleChange,
          handleBlur,
          handleSubmit,
          isSubmitting,
        }) => (
          <form className="Post__Reply" onSubmit={handleSubmit}>
            <Field
              onChange={handleChange}
              name="commentBody"
              formNoValidate={true}
              onBlur={handleBlur}
              value={values.commentBody}
              as="textarea"
            />
            <button type="submit" disabled={isSubmitting}>
              Post
            </button>
          </form>
        )}
      </Formik>

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
