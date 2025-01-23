import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./Navbar.tsx";
import CreateUser from "./components/user/CreateUser.tsx";
import UpdateUser from "./components/user/UpdateUser.tsx";
import GetUserList from "./components/user/GetUserList.tsx";
import GetUserById from "./components/user/GetUserById.tsx";
import CreateArticle from "./components/article/CreateArticle.tsx";
import UpdateArticle from "./components/article/UpdateArticle.tsx";
import GetArticleList from "./components/article/GetArticleList.tsx";
import GetArticleById from "./components/article/GetArticleById.tsx";
const App: React.FC = () => {
  return (
    <Router>
      <Navbar />
      <div>
        <Routes>
        <Route
            path="/articles/create"
            element={<CreateArticle />} />
          <Route
            path="/articles/update/:articleId"
            element={<UpdateArticle />} />
          <Route
            path="/articles/get"
            element={<GetArticleList />} />
          <Route
            path="/articles/getById/:articleId"
            element={<GetArticleById />} />

          <Route
            path="/users/create"
            element={<CreateUser />} />
          <Route
            path="/users/update/:userId"
            element={<UpdateUser />} />
          <Route
            path="/users/get"
            element={<GetUserList />} />
          <Route
            path="/users/getById/:userId"
            element={<GetUserById />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
