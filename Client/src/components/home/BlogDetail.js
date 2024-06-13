import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import BlogApi from "../../getApi/BlogApi";
import icons from "../../utils/icons";
import Comment from "./Comment";
import "../../assets/css/style.css";
import HandleCookies from "../../utils/HandleCookies";
import { GrSend } from "react-icons/gr";
import CommentApi from "../../getApi/CommentApi";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { relativeTime } from "../../utils/timeManufacture";
import Ranking from "./Ranking";
const {
  RiAttachment2,
  BiSolidUpArrow,
  BiSolidDownArrow,
  FaUser,
  BsCalendar2DateFill,
} = icons;

const BlogDetail = () => {
  const ref = useRef();
  const [p, setP] = useState();
  const [forceupdate, setForceupdate] = useState(false);
  const [text, setText] = useState("");
  let { blog } = useParams();
  useEffect(() => {
    BlogApi.getBlogById(blog)
      .then((res) => {
        setP(res?.data?.data);
      })
      .catch((err) => console.log("error"));
  }, [forceupdate]);
  const handleLike = async () => {
    const accessToken = HandleCookies.getCookie("accessToken");
    if (!accessToken) {
      alert("Please login to continue...");
      return;
    }
    try {
      const res = await BlogApi.updateLike({ blog: p._id, accessToken });
      showSuccessToast("Update like successfully");
      setP(res?.data?.data);
    } catch (error) {
      showErrorToast(error?.response?.data);
    }
  };
  const handleDislike = async () => {
    const accessToken = HandleCookies.getCookie("accessToken");
    if (!accessToken) {
      alert("Please login to continue...");
      return;
    }
    try {
      const res = await BlogApi.updateDislike({ blog: p._id, accessToken });
      showSuccessToast("Update dislike successfully");
      setP(res?.data?.data);
    } catch (error) {
      showErrorToast(error?.response?.data);
    }
  };

  const handleSubmit = async () => {
    const accessToken = HandleCookies.getCookie("accessToken");
    if (!accessToken) {
      alert("Please login to write comment");
      return;
    }
    try {
      const res = await CommentApi.createComment({
        blogId: p._id,
        accessToken,
        content: text,
      });
      showSuccessToast("Comment was created successfully");
      setText("");
      ref.current.value = "";
      setForceupdate(!forceupdate);
    } catch (err) {
      showErrorToast("Oww! Something wrong");
    }
  };

  const showSuccessToast = (msg) => {
    toast.success(msg || `Compiled Successfully!`, {
      position: "top-right",
      autoClose: 1000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  };

  const showErrorToast = (msg, timer) => {
    toast.error(msg || `Something went wrong! Please try again.`, {
      position: "top-right",
      autoClose: timer ? timer : 1000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  };

  return (
    <div>
      <ToastContainer
        position="top-center"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <div className="text-left mt-5">
        <h1 className="text-blue-800 text-[30px] font-bold">
          {<div dangerouslySetInnerHTML={{ __html: p?.title }} />}
        </h1>
        <p className="flex gap-1">
          By{" "}
          <span className="">
            <a href={"/profile/" + p?.author?.username}>
              <Ranking
                username={p?.author?.username}
                rating={p?.author?.rating}
                title={false}
              />
            </a>
          </span>
          , {relativeTime(p?.createdAt)}
        </p>
        <div className="border-l-[4px] border-solid border-gray-400 px-3">
          {<div dangerouslySetInnerHTML={{ __html: p?.content }} />}
        </div>
        <div className="flex items-center text-[12px]">
          <RiAttachment2 size={15} />
          Announcement of{" "}
          <span className="text-gray-500 mx-[5px]">
            {p?.tags?.map((tag) => tag.name).join(", ")}
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
                p?.likes?.length - p?.dislikes.length >= 0
                  ? "text-green-700 text-[16px] font-bold"
                  : "text-red-500 text-[16px] font-bold"
              }
            >
              {p?.likes?.length - p?.dislikes.length || 0}
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
                <a href={"/profile/" + p?.author?.username}>
                  {p?.author?.username}
                </a>
              </span>
            </div>
            <div className="flex h-full items-center mx-[10px]">
              <BsCalendar2DateFill className="mx-[5px]" />
              <span className="underline">{p?.createdAt?.slice(0, 10)}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full">
        <div className="border-[2px] rounded-md border-solid mt-[15px] mr-5 border-gray-300 text-left p-3 flex items-center">
          <textarea
            type="text"
            placeholder="Write something..."
            className="focus:outline-none w-full"
            onChange={(e) => setText(e.target.value)}
            ref={ref}
          />
          <button onClick={handleSubmit}>
            <GrSend className="text-[30px]" />
          </button>
        </div>
      </div>
      <div className="w-full">
        <div className="border-[2px] rounded-md border-solid mt-[15px] mr-5 border-gray-300 text-left p-3">
          {p?.comments?.map((comment) => (
            <Comment id={comment} />
          ))}
        </div>
      </div>
    </div>
  );
};
export default BlogDetail;
