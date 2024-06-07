import Blog from "./Blog";
import Blogs from "./Blogs";
import { Route, Routes } from "react-router-dom";
import Profile from "./Profile";
import Rating from "./Rating";
import Calendar from "./Calendar";
import path from "../../utils/path";
import Login from "./Login";
import { CreateProblem, SearchList } from ".";
import { useLocation } from "react-router-dom";
import Editor from "../Editor";
import SignUp from "./SignUp";
import Setting from "./Setting";
import BlogDetail from "./BlogDetail";
import Message from "./Message";
import Landing from "../CodeEditor/Components/Landing";
import Ide from "../CodeEditor/Components/Ide";
import Problem from "./Problem";
import RichTextInput from "../RichTextInput";
const Main = () => {
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
        <Route path={path.RATING} element={<Rating />} />
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
      </Routes>
    </div>
  );
};
export default Main;
