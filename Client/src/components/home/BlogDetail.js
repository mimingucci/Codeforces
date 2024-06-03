import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import BlogApi from "../../getApi/BlogApi";
import icons from "../../utils/icons";
import Comment from "./Comment";
import { useLocation } from "react-router-dom";
import { demoClientId, demoContent, demoHeadline } from "../demo";
import { Grammarly, GrammarlyEditorPlugin } from "@grammarly/editor-sdk-react";
import "../../assets/css/style.css";
import { Editor } from "@tinymce/tinymce-react";
import HandleCookies from "../../utils/HandleCookies";

const {
  FaAnglesRight,
  RiAttachment2,
  BiSolidUpArrow,
  BiSolidDownArrow,
  FaUser,
  BsCalendar2DateFill,
  IoIosChatboxes,
} = icons;
let title = null;
let content = null;
const BlogDetail = () => {
  const [p, setP] = useState();
  const [like, setLike] = useState(0);
  const [comment, setComment] = useState("Content");
  const [home, setHome] = useState(false);
  const location = useLocation();
  let { blog } = useParams();
  useEffect(() => {
    BlogApi.getBlogById(blog)
      .then((res) => {
        console.log(res);
        title = { __html: res?.data?.title };
        content = { __html: res?.data?.content };
        setP(res?.data);
        setLike(p?.likes?.length - p?.dislikes?.length);
      })
      .catch((err) => console.log("error"));
    const author = HandleCookies.getCookie("nickname");
    if (
      author != null &&
      author.length > 0 &&
      location?.pathname.split("/")[2] == author
    ) {
      setHome(true);
    }
  }, [p?.id]);
  const handleLike = async () => {
    const username = HandleCookies.getCookie("username");
    const id = p?.id;
    try {
      const res = await BlogApi.updateLike(id, username);
      setLike(like + 1);
    } catch (error) {
      alert(error?.response?.data);
    }
  };
  const handleDislike = async () => {
    const username = HandleCookies.getCookie("username");
    const id = p?.id;
    try {
      const res = await BlogApi.updateDislike(id, username);
      setLike(like - 1);
    } catch (error) {
      alert(error?.response?.data);
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const author = HandleCookies.getCookie("username");
    if (author == null || author.length == 0) {
      alert("Please login to write review");
      return;
    }
    console.log(author, comment);
    try {
      const res = await BlogApi.createComment(p?.id, author, comment);
      alert("Your comment created success");
      window.location.replace(location?.pathname);
    } catch (err) {
      alert("Oww! Something wrong");
    }
  };
  const handleChangeContent = (e) => {
    setComment(e.target.getContent());
  };
  return (
    <div>
      <div className="text-left mt-5">
        <h1 className="text-blue-800 text-[30px] font-bold">
          {<div dangerouslySetInnerHTML={title} /> || "Educational top user"}
        </h1>
        <p>
          By{" "}
          <span className="underline">
            <a href={"/profile/" + p?.author || "/profile/mimingucci"}>
              {p?.author || "mimingucci"}
            </a>
          </span>
          , {((new Date() - new Date(p?.postedtime)) / (1000 * 60 * 60)) | 0}{" "}
          hours ago
        </p>
        <div className="border-l-[4px] border-solid border-gray-400 px-3">
          {<div dangerouslySetInnerHTML={content} /> || "Lionel Messi"}
        </div>
        <div className="flex items-center text-[12px]">
          <RiAttachment2 size={15} />
          Announcement of{" "}
          <span className="text-gray-500 mx-[5px]">
            {p?.content || "Educational top user"}
          </span>
        </div>
        <div className="border-[2px] rounded-md border-solid h-[50px] mt-3 mr-5 border-gray-300 text-center">
          <div className="inline-flex items-center h-full">
            <BiSolidUpArrow
              size={20}
              className="text-green-300 mx-[5px] hover:cursor-pointer"
              onClick={handleLike}
            />
            <span
              className={
                like >= 0
                  ? "text-green-700 text-[16px] font-bold"
                  : "text-red-500 text-[16px] font-bold"
              }
            >
              {like || 0}
            </span>
            <BiSolidDownArrow
              size={20}
              className="text-red-300 mx-[5px] hover:cursor-pointer"
              onClick={handleDislike}
            />
          </div>
          <div className="h-full inline-flex">
            <div className="flex h-full items-center pl-[470px] mx-[10px]">
              <FaUser className="mx-[5px]" />
              <span className="underline">
                <a href={"/profile/" + p?.author || "/profile/mimingucci"}>
                  {p?.author || "mimingucci"}
                </a>
              </span>
            </div>
            <div className="flex h-full items-center mx-[10px]">
              <BsCalendar2DateFill className="mx-[5px]" />
              <span className="underline">{p?.postedtime.slice(0, 10)}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full">
        <div className="border-[2px] rounded-md border-solid mt-[15px] mr-5 border-gray-300 text-left p-3">
          {p?.comments?.map((comment) => (
            <Comment comment={comment} />
          ))}
        </div>
      </div>

      <div className={home ? "hidden" : "w-full"}>
        <div className="border-[2px] rounded-md border-solid mt-[15px] mr-5 border-gray-300 text-left p-3">
          <form>
            <Grammarly
              clientId={demoClientId}
              config={{
                documentDialect: "british",
                autocomplete: "on",
              }}
            >
              {/* Wrap the rich text editor with <GrammarlyEditorPlugin> to add Grammarly suggestions  */}
              <GrammarlyEditorPlugin
                clientId={demoClientId}
                config={{
                  documentDialect: "british",
                  autocomplete: "on",
                }}
              >
                {/* Add a TinyMCE rich text editor */}
                <Editor
                  id="Comment"
                  initialValue={demoContent.textarea}
                  init={{
                    height: 300,
                    menubar: true,
                  }}
                  onChange={handleChangeContent}
                />
                <div className="col-md-3 text-center">
                  <button
                    className="btn btn-block btn-primary btn-lg bg-blue-500 rounded-sm px-5 py-3 text-white mt-[10px]"
                    type="submit"
                    onClick={handleSubmit}
                  >
                    Post
                  </button>
                </div>
              </GrammarlyEditorPlugin>
            </Grammarly>
          </form>
        </div>
      </div>
    </div>
  );
};
export default BlogDetail;
