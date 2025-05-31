import { useTranslation } from "react-i18next";
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
  const { t } = useTranslation();

  return (
    <div className="w-[25%] border-[2px] rounded-t-md border-solid border-gray-400 mt-4 h-fit">
      <div className="flex items-center text-blue-800">
        <FaArrowRightLong size={20} className="mx-[5px] " />
        {t("problemInfo.problemInformation")}
      </div>
      <hr />
      <div>
        <div>
          <div className="flex mx-[5px] items-center">
            {t("problemInfo.author")}: {author}
          </div>
        </div>
        <div>
          <div className="flex mx-[5px] items-center">
            {t("problemInfo.tries")}: {submissions?.length}{" "}
          </div>
          <div className="flex mx-[5px] items-center">
            {t("problemInfo.accept")}:{" "}
            {submissions?.reduce((cnt, submission) => {
              if (submission?.status === "Accepted") {
                return cnt + 1;
              } else {
                return cnt;
              }
            }, 0)}
          </div>
          <div className="flex mx-[5px] items-center">
            {t("problemInfo.tags")}: {tags?.map((tag) => tag.name).join(", ")}
          </div>
          <div className="flex mx-[5px] items-center">
            {t("problemInfo.rating")}: {rating}
          </div>
          <div className="mx-[5px]">
            <button
              className={`border-collapse border-2 border-black bg-gray-300 px-3 my-3 ${
                solution ? "" : "hidden"
              }`}
            >
              <a href={solution}>{t("problemInfo.solution")}</a>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ProblemNavbar;
