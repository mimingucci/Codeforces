import { useState } from "react";
import CommentApi from "../../getApi/CommentApi";
import icons from "../../utils/icons";
import HandleCookies from '../../utils/HandleCookies'
const { BiSolidUpArrow, BiSolidDownArrow, FaAnglesRight } = icons;

const Comment = ({ comment }) => {
  const content = { __html: comment?.content };
  const [like, setLike] = useState(
    comment?.agree.length - comment?.disagree.length
  );
  const handleLike = async () => {
    const nickname = HandleCookies.getCookie("nickname");
    const id = comment?.id;
    try {
      const res = await CommentApi.updateLike(id, nickname);
      setLike(like + 1);
    } catch (error) {
      alert(error?.response?.data);
    }
  };
  const handleDislike = async () => {
    const nickname = HandleCookies.getCookie("nickname");
    const id = comment?.id;
    try {
      const res = await CommentApi.updateDislike(id, nickname);
      setLike(like - 1);
    } catch (error) {
      alert(error?.response?.data);
    }
  };
  return (
    <div className="py-3">
      <div className="flex justify-between">
        <div>
          <a className="inline-block pr-3" href={"/profile/" + comment?.author}>
            {comment?.author}
          </a>
          <FaAnglesRight size={10} className="inline-block" />
          <div className="inline-block px-3">
            <div dangerouslySetInnerHTML={content} />
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
        </div>
      </div>
      <div>
        <p className="text-sm text-gray-600">
          {comment?.commenttime?.slice(0, 10)}
        </p>
      </div>
    </div>
  );
};
export default Comment;
