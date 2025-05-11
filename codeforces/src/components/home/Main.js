import Blogs from "./Blogs";
import { Route, Routes } from "react-router-dom";
import Profile from "./Profile";
import Calendar from "./Calendar";
import path from "../../utils/path";
import Login from "./Login";
import { Rating, SearchList } from ".";
import { useLocation } from "react-router-dom";
import SignUp from "./SignUp";
import Setting from "./Setting";
import BlogDetail from "./BlogDetail";
import Message from "./Message";
import Ide from "../CodeEditor/Components/Ide";
import Problem from "./Problem";
import RichTextInput from "../RichTextInput";
import Problems from "./Problems";
import EditBlog from "./EditBlog";
import ErrorPage from "../ErrorPage";
import Submission from "./Submission";
import SubmitDetail from "./SubmitDetail";
import ForgotPassword from "./ForgotPassword";
import ResetPassword from "./ResetPassword";
import ChatPage from "../Chat/ChatPage";
import ContestPage from "../contest/ContestPage";
import ContestDetail from "../contest/ContestDetail";
import VerifyEmail from "./VerifyEmail";

const Main = () => {
  const location = useLocation();
  let inLoginPage = false;
  if (
    location?.pathname === "/login" ||
    location?.pathname === "/signup" ||
    location?.pathname === "/ide" ||
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
        <Route path={path.VERIFY_EMAIL} element={<VerifyEmail />} />
        <Route path={path.SIGNUP} element={<SignUp />} />
        <Route path={path.CONTEST} element={<ContestPage />} />
        <Route path={path.CONTESTDETAIL} element={<ContestDetail />} />
        <Route path={path.SETTING} element={<Setting />} />
        <Route path={path.BLOG} element={<BlogDetail />} />
        <Route path={path.MESSAGE} element={<Message />} />
        <Route path={path.IDE} element={<Ide />} />
        <Route path={path.PROBLEM} element={<Problem />} />
        <Route path={path.PROBLEMS} element={<Problems userPage={false} />} />
        <Route path={path.EDITBLOG} element={<EditBlog />} />
        <Route path={path.SUBMIT} element={<Submission />} />
        <Route path={path.SUBMITDETAIL} element={<SubmitDetail />} />
        <Route path={path.FORGOTPASSWORD} element={<ForgotPassword />} />
        <Route path={path.RESETPASSWORD} element={<ResetPassword />} />
        <Route path={path.CHAT} element={<ChatPage />} />
        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </div>
  );
};
export default Main;
