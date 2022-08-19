import { useParams, useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en.json";
import { Field, Formik } from "formik";

TimeAgo.addDefaultLocale(en);

// Create formatter (English).
const timeAgo = new TimeAgo("en-US");

export function CommentReply() {
  const { postId, commentId } = useParams();
  const [postWithSingleComment, setPostWithSingleComment] = useState(null);
  const navigate = useNavigate();
  const authToken = localStorage.getItem("AUTH");

  useEffect(() => {
    if (!authToken) {
      navigate("/login");
      return;
    }
    fetch(`/api/posts/${postId}/comment/${commentId}`, {
      headers: {
        Authorization: authToken,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setPostWithSingleComment(data);
      })
      .catch((err) => {
        alert("Oh No!");
        console.log(err.mesasge);
      });
  }, []);

  if (!postWithSingleComment) {
    return <h1>Loading</h1>;
  }

  const { post, comment } = postWithSingleComment;

  const openLink = () => {
    // @ts-ignore
    window.open(post.link);
  };

  if (!authToken) {
    navigate("/login");
    return <></>;
  }

  return (
    <div>
      <h1>Replying to Single Comment</h1>
      {/*THIS IS AN EXACT COPY! AHH*/}
      <div className="PostCard" onClick={openLink}>
        <div className="PostCard__Details">
          {/*@ts-ignore*/}
          <p>{post?.title}</p>
          <span>
            {/*@ts-ignore*/}
            {post?.createdAt &&
              // @ts-ignore
              timeAgo.format(Date.parse(post.createdAt))}
          </span>
          {/*@ts-ignore*/}
          <span>{post?.author?.displayName}</span>
        </div>
      </div>

      <br />

      {/*THIS IS AN EXACT COPY! AHH*/}
      <div className="Comment">
        <div className="Comment__Metadata">
          {/* @ts-ignore*/}
          <span>{comment.author.displayName}</span>
          {/* @ts-ignore*/}
          <span>{timeAgo.format(Date.parse(comment.createdAt))}</span>
        </div>
        {/* @ts-ignore*/}
        <span>{comment.body}</span>
        <a className="Comment__Reply" href="/">
          Reply
        </a>
      </div>

      <br />

      <Formik
        initialValues={{ commentBody: "" }}
        validate={(values) => {
          return [];
        }}
        onSubmit={async (values, { setSubmitting, resetForm }) => {
          setSubmitting(true);
          const commentBody = {
            // @ts-ignore
            body: values.commentBody,
            parentCommentId: commentId,
          };
          await fetch(`/api/posts/${postId}/comment`, {
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
          navigate(-1);
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
    </div>
  );
}
