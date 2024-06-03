import { useEffect, useState } from "react";
import icons from "../../utils/icons";
import UserApi from "../../getApi/UserApi";
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
const Blog = ({ blog }) => {
  const [user, setUser] = useState(null);
  useEffect(() => {
    async function getUsername() {
      try {
        const rs = await UserApi.getUserById(blog?.author);
        setUser(rs?.data?.data);
      } catch (error) {
        console.error(error);
      }
    }
    getUsername();
  }, []);
  const [like, setLike] = useState(blog?.likes.length - blog?.dislikes.length);
  const title = { __html: blog?.title };
  const content = { __html: blog?.content };
  const handleLike = async () => {
    // const nickname = HandleCookies.getCookie("nickname");
    // const id = blog?.id;
    // try {
    //   const res = await BlogApi.updateLike(id, nickname);
    //   setLike(like + 1);
    // } catch (error) {
    //   alert(error?.response?.data);
    // }
  };
  const handleDislike = async () => {
    // const nickname = HandleCookies.getCookie("nickname");
    // const id = blog?.id;
    // try {
    //   const res = await BlogApi.updateDislike(id, nickname);
    //   setLike(like - 1);
    // } catch (error) {
    //   alert(error?.response?.data);
    // }
  };
  return (
    <div className="text-left mt-5">
      <h1 className="text-blue-800 text-[30px] font-bold">
        {<div dangerouslySetInnerHTML={title} /> || "Educational top user"}
      </h1>
      <p>
        By{" "}
        <span className="underline">
          <a href={"/profile/" + blog?.author || "/profile/mimingucci"}>
            {user?.username || "..."}
          </a>
        </span>
        , {((new Date() - new Date(blog?.createdAt)) / (1000 * 60 * 60)) | 0}{" "}
        hours ago
      </p>
      <div className="border-l-[4px] border-solid border-gray-400 px-3">
        {<div dangerouslySetInnerHTML={content} /> || "Lionel Messi"}
      </div>
      <div className="flex text-blue-800 items-center text-[12px]">
        <a href={"/post/" + blog?.id}>Full text and comments</a>
        <FaAnglesRight size={10} />
      </div>
      <div className="flex items-center text-[12px]">
        <RiAttachment2 size={15} />
        Announcement of{" "}
        <span className="text-gray-500 mx-[5px]">
          {blog?.content || "Educational top user"}
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
              <a href={"/profile/" + user?.username || "/profile/..."}>
                {"mimingucci"}
              </a>
            </span>
          </div>
          <div className="flex h-full items-center mx-[10px]">
            <BsCalendar2DateFill className="mx-[5px]" />
            <span className="underline">{blog?.createdAt.slice(0, 10)}</span>
          </div>
          <div className="flex h-full items-center mx-[10px]">
            <IoIosChatboxes className="mx-[5px]" />
            <span className="underline">{blog?.comments.length || 0}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Blog;
