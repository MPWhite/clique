import React from "react";
import "./App.scss";
import { PostForm } from "./features/postForm/PostForm";
import { PostFeed } from "./features/postFeed/PostFeed";
import { Post } from "./features/postView/Post";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { CommentReply } from "./features/postView/CommentReply";
import { Login } from "./features/auth/Login";
import { InviteList } from "./features/invitations/InviteList";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={"/"} element={<PostFeed />} />
        <Route path={"/login"} element={<Login />} />
        <Route path={"/post/:postId"} element={<Post />} />
        <Route
          path={"/post/:postId/comment/:commentId"}
          element={<CommentReply />}
        />
        <Route path={"/submit-post"} element={<PostForm />} />
        <Route path={"/invites"} element={<InviteList />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
