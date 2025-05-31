import "../../assets/css/ranking.css";
import { useTranslation } from "react-i18next";

const Ranking = ({ username, rating = 0, title = false }) => {
  const { t } = useTranslation();

  const getRankData = (rating) => {
    if (rating < 1200)
      return { title: t("ranking.newbie"), color: "text-gray-600" };
    if (rating < 1400)
      return { title: t("ranking.pupil"), color: "text-green-600" };
    if (rating < 1600)
      return { title: t("ranking.specialist"), color: "text-cyan-400" };
    if (rating < 1900)
      return { title: t("ranking.expert"), color: "text-blue-600" };
    if (rating < 2400)
      return { title: t("ranking.master"), color: "text-yellow-300" };
    if (rating < 3000)
      return { title: t("ranking.grandmaster"), color: "text-purple-600" };
    return { title: t("ranking.legendaryGrandmaster"), color: "text-red-600" };
  };

  const { title: rankTitle, color } = getRankData(rating);

  if (title) {
    return (
      <>
        <h1 className={`text-[20px] ${color} font-bold`}>{rankTitle}</h1>
        <h1 className={`text-[20px] ${color} font-bold`}>
          {username || t("ranking.username")}
        </h1>
      </>
    );
  }

  return <p className={color}>{username || t("ranking.username")}</p>;
};

export default Ranking;
