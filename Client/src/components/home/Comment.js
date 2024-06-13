import { useEffect, useState } from "react";
import CommentApi from "../../getApi/CommentApi";
import icons from "../../utils/icons";
import HandleCookies from "../../utils/HandleCookies";
import Ranking from "./Ranking";
const { BiSolidUpArrow, BiSolidDownArrow, FaAnglesRight } = icons;

const Comment = ({ id }) => {
  const [comment, setComment] = useState(null);
  useEffect(() => {
    CommentApi.getCommentById(id).then((rs) => {
      setComment(rs.data.data);
    });
  }, [id]);
  const handleLike = async () => {
    const accessToken = HandleCookies.getCookie("accessToken");
    try {
      const res = await CommentApi.updateLike({
        comment: comment._id,
        accessToken,
      });
      setComment(res.data.data);
    } catch (error) {
      alert("Somthing went wrong, try again later");
    }
  };
  const handleDislike = async () => {
    const accessToken = HandleCookies.getCookie("accessToken");
    try {
      const res = await CommentApi.updateDislike({
        comment: comment._id,
        accessToken,
      });
      setComment(res.data.data);
    } catch (error) {
      alert("Somthing went wrong, try again later");
    }
  };
  return (
    <div className="py-3">
      <div className="flex justify-between">
        <div className="flex">
          <div>
            <a
              className="inline-block pr-3"
              href={"/profile/" + comment?.author.username}
            >
              <div className="flex justify-center">
                <img
                  src={comment?.author?.avatar}
                  className="w-[50px] h-auto"
                />
              </div>
              <Ranking
                username={comment?.author?.username}
                rating={comment?.author?.rating}
                title={false}
              />
            </a>
          </div>

          <div className="inline-block px-3">
            {/* <FaAnglesRight size={10} className="inline-block" /> */}
            <div dangerouslySetInnerHTML={{ __html: comment?.content }} />
          </div>
        </div>
        <div>
          <div className="inline-flex items-center h-full">
            <BiSolidUpArrow
              size={20}
              className="text-green-300 mx-[5px] hover:cursor-pointer"
              onClick={handleLike}
            />
            <span
              className={
                comment?.likes.length - comment?.dislikes.length >= 0
                  ? "text-green-700 text-[16px] font-bold"
                  : "text-red-500 text-[16px] font-bold"
              }
            >
              {comment?.likes.length - comment?.dislikes.length || 0}
            </span>
            <BiSolidDownArrow
              size={20}
              className="text-red-300 mx-[5px] hover:cursor-pointer"
              onClick={handleDislike}
            />
          </div>
        </div>
      </div>
      <div>
        <p className="text-sm text-gray-600 text-right">
          {comment?.updatedAt?.slice(0, 10)}
        </p>
      </div>
    </div>
  );
};
export default Comment;
