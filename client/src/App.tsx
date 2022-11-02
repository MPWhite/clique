import React from "react";
import "./App.scss";
import { PostForm } from "./features/postForm/PostForm";
import { PostFeed } from "./features/postFeed/PostFeed";
import { Post } from "./features/postView/Post";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { CommentReply } from "./features/postView/CommentReply";
import { Login } from "./features/auth/Login";
import { InviteList } from "./features/invitations/InviteList";
import { HeaderNav } from "./features/cliqueDropdown/HeaderNav";

function ComponentWithHeader({ children }: any) {
  return (
    <div>
      <HeaderNav />
      {children}
    </div>
  );
}

function componentWithHeader(Component: any) {
  return <ComponentWithHeader>{Component}</ComponentWithHeader>;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={"/"} element={componentWithHeader(<PostFeed />)} />
        <Route path={"/login"} element={<Login />} />
        <Route path={"/post/:postId"} element={componentWithHeader(<Post />)} />
        <Route
          path={"/post/:postId/comment/:commentId"}
          element={componentWithHeader(<CommentReply />)}
        />
        <Route
          path={"/submit-post"}
          element={componentWithHeader(<PostForm />)}
        />
        <Route
          path={"/invites"}
          element={componentWithHeader(<InviteList />)}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
