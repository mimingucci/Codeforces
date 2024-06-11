import { useState } from "react";
import icons from "../../utils/icons";
import BlogApi from "../../getApi/BlogApi";
import HandleCookies from "../../utils/HandleCookies";
import { toast } from "react-toastify";
import { relativeTime } from "../../utils/timeManufacture";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
const {
  FaAnglesRight,
  RiAttachment2,
  BiSolidUpArrow,
  BiSolidDownArrow,
  FaUser,
  BsCalendar2DateFill,
  IoIosChatboxes,
} = icons;
const Blog = ({ blog }) => {
  const [like, setLike] = useState(blog?.likes.length - blog?.dislikes.length);
  const navigate = useNavigate();
  const handleLike = async () => {
    const accessToken = HandleCookies.getCookie("accessToken");
    if (!accessToken) {
      showErrorToast("Please login to continue...");
      return;
    }
    const id = blog?._id;
    try {
      const res = await BlogApi.updateLike({ blog: id, accessToken });
      showSuccessToast("Update like successfully");
      setLike(res?.data?.data?.likes.length - res?.data?.data?.dislikes.length);
    } catch (error) {
      showErrorToast("Update like failed");
    }
  };
  const handleDislike = async () => {
    const accessToken = HandleCookies.getCookie("accessToken");
    if (!accessToken) {
      showErrorToast("Please login to continue...");
      return;
    }
    const id = blog?._id;
    try {
      const res = await BlogApi.updateDislike({ blog: id, accessToken });
      showSuccessToast("Update dislike successfully");
      setLike(res?.data?.data?.likes.length - res?.data?.data?.dislikes.length);
    } catch (error) {
      showErrorToast("Update dislike failed");
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
    <div className="text-left mt-5">
      <div className="flex gap-5">
        <h1 className="text-blue-800 text-[30px] font-bold">
          {
            <a href={`/blog/${blog?._id}`}>
              <div dangerouslySetInnerHTML={{ __html: blog?.title }} />
            </a>
          }
        </h1>
        <button
          onClick={() => navigate(`/editblog/${blog?._id}`)}
          className={
            blog?.author?.username === HandleCookies.getCookie("username")
              ? "bg-gray-300 px-3 h-fit"
              : "hidden"
          }
        >
          Edit
        </button>
      </div>
      <p>
        By{" "}
        <span className="underline">
          <a href={"/profile/" + blog?.author?.username}>
            {blog?.author?.username}
          </a>
        </span>
        , {relativeTime(blog?.createdAt)}
      </p>
      <div className="border-l-[4px] border-solid border-gray-400 px-3">
        {<div dangerouslySetInnerHTML={{ __html: blog?.content }} />}
      </div>
      <div className="flex text-blue-800 items-center text-[12px]">
        <a href={"/blog/" + blog?._id}>Full text and comments</a>
        <FaAnglesRight size={10} />
      </div>
      <div className="flex items-center text-[12px]">
        <RiAttachment2 size={15} />
        Announcement of{" "}
        <span className="text-gray-500 mx-[5px]">
          {blog?.tags.map((tag) => tag.name).join(", ")}
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
            {like}
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
              <a href={"/profile/" + blog?.author?.username}>
                {blog?.author?.username}
              </a>
            </span>
          </div>
          <div className="flex h-full items-center mx-[10px]">
            <BsCalendar2DateFill className="mx-[5px]" />
            <span className="underline">{blog?.createdAt.slice(0, 10)}</span>
          </div>
          <div className="flex h-full items-center mx-[10px]">
            <IoIosChatboxes className="mx-[5px]" />
            <span className="underline">{blog?.comments.length}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Blog;
