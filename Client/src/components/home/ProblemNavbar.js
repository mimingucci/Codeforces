import icons from "../../utils/icons";
const {
  FaArrowRightLong,
  FaStar,
  GoDotFill,
  FaAnglesRight,
  RiAttachment2,
  BiSolidUpArrow,
  BiSolidDownArrow,
  FaUser,
  BsCalendar2DateFill,
  IoIosChatboxes,
} = icons;

const ProblemNavbar = ({
  author,
  tags = [],
  likes = [],
  dislikes = [],
  submissions = [],
  rating = null,
}) => {
  return (
    <div className="w-[25%] border-[2px] rounded-t-md border-solid border-gray-400 mt-4 h-fit">
      <div className="flex items-center text-blue-800">
        <FaArrowRightLong size={20} className="mx-[5px] " />
        Problem Info
      </div>
      <hr />
      <div>
        <div>
          <div className="flex mx-[5px] items-center">Author: {author}</div>
        </div>
        <div>
          <div className="flex mx-[5px] items-center">
            Tries: {submissions?.length}{" "}
          </div>
          <div className="flex mx-[5px] items-center">
            Accept:{" "}
            {submissions?.reduce((cnt, submission) => {
              if (submission?.status === "Accepted") {
                return cnt + 1;
              } else {
                return cnt;
              }
            }, 0)}
          </div>
          <div className="flex mx-[5px] items-center">
            Tags:{" "}
            {tags?.map((tag) => {
              return tag.name;
            })}
          </div>
          <div className="mx-[5px]">
            <div className="text-left">Vote:</div>
            <div className="flex">
              <BiSolidUpArrow
                size={20}
                className="text-green-300 mx-[5px] hover:cursor-pointer"
                //   onClick={handleLike}
              />
              <span className="text-green-700 text-[16px] font-bold">
                {likes?.length}
              </span>
            </div>
            <div className="flex">
              <BiSolidDownArrow
                size={20}
                className="text-red-300 mx-[5px] hover:cursor-pointer"
                //   onClick={handleDislike}
              />
              <span className="text-red-500 text-[16px] font-bold">
                {dislikes?.length}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ProblemNavbar;
