import HandleCookies from "../../utils/HandleCookies";
import icons from "../../utils/icons";
const { FaArrowRightLong } = icons;

const ProblemNavbar = ({
  problem,
  author,
  tags = [],
  likes = [],
  dislikes = [],
  submissions = [],
  rating = null,
  solution = null,
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
            Tags: {tags?.map((tag) => tag.name).join(", ")}
          </div>
          <div className="flex mx-[5px] items-center">Rating: {rating}</div>
          <div className="mx-[5px]">
            <button
              className={`border-collapse border-2 border-black bg-gray-300 px-3 my-3 ${
                solution ? "" : "hidden"
              }`}
            >
              <a href={solution}>Solution</a>
            </button>
          </div>
          <div className="mx-[5px]">
            <button
              className={`border-collapse border-2 border-black bg-gray-300 px-3 my-3 ${
                author == HandleCookies.getCookie("username") ? "" : "hidden"
              }`}
            >
              <a href={"/editproblem/" + problem} target="_blank">
                Edit Problem
              </a>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ProblemNavbar;
