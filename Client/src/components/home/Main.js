import Blogs from "./Blogs";
import { Route, Routes } from "react-router-dom";
import Profile from "./Profile";
import Calendar from "./Calendar";
import path from "../../utils/path";
import Login from "./Login";
import { CreateProblem, SearchList } from ".";
import { useLocation } from "react-router-dom";
import SignUp from "./SignUp";
import Setting from "./Setting";
import BlogDetail from "./BlogDetail";
import Message from "./Message";
import Ide from "../CodeEditor/Components/Ide";
import Problem from "./Problem";
import RichTextInput from "../RichTextInput";
import Problems from "./Problems";
import EditProblem from "./EditProblem";
import EditBlog from "./EditBlog";
import ErrorPage from "../ErrorPage";
import Submission from "./Submission";
import SubmitDetail from "./SubmitDetail";
import UserBlog from "./UserBlog";
import io from "socket.io-client";
import Home from "../Chat/Home/home";
import Chat from "../Chat/Chat/Room";
import { useState } from "react";

const socket = io.connect("http://localhost:1234");

const Main = () => {
  const [username, setUsername] = useState("");
  const [room, setRoom] = useState("");
  const location = useLocation();
  let inLoginPage = false;
  if (
    location?.pathname == "/login" ||
    location?.pathname == "/signup" ||
    location?.pathname == "/ide" ||
    location?.pathname.startsWith("/problem")
  ) {
    inLoginPage = true;
  } else {
    inLoginPage = false;
  }
  return (
    <div className={inLoginPage ? "w-full" : "w-[75%]"}>
      <Routes>
        <Route path={path.PUBLIC} element={<Blogs />}>
          <Route path={path.HOME} element={<Blogs />} />
        </Route>
        <Route path={path.SEARCH} element={<SearchList />} />
        <Route path={path.RATING} element={<Problems userPage={true} />} />
        <Route path={path.USER} element={<Profile />} />
        <Route path={path.CALENDAR} element={<Calendar />} />
        <Route path={path.LOGIN} element={<Login />} />
        <Route path={path.WRITEBLOG} element={<RichTextInput />} />
        <Route path={path.SIGNUP} element={<SignUp />} />
        <Route path={path.SETTING} element={<Setting />} />
        <Route path={path.BLOG} element={<BlogDetail />} />
        <Route path={path.MESSAGE} element={<Message />} />
        <Route path={path.IDE} element={<Ide />} />
        <Route path={path.PROBLEM} element={<Problem />} />
        <Route path={path.CREATEPROBLEM} element={<CreateProblem />} />
        <Route path={path.PROBLEMS} element={<Problems userPage={false} />} />
        <Route path={path.EDITPROBLEM} element={<EditProblem />} />
        <Route path={path.EDITBLOG} element={<EditBlog />} />
        <Route path={path.SUBMIT} element={<Submission />} />
        <Route path={path.SUBMITDETAIL} element={<SubmitDetail />} />
        <Route path={path.USERBLOG} element={<UserBlog />} />
        <Route
          path="/usertalk"
          element={
            <Home
              username={username}
              setUsername={setUsername}
              room={room}
              setRoom={setRoom}
              socket={socket}
            />
          }
        />
        <Route
          path="/chat"
          element={<Chat username={username} room={room} socket={socket} />}
        />
        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </div>
  );
};
export default Main;
