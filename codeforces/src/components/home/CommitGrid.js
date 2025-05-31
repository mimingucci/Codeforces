import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import CalendarHeatmap from "react-calendar-heatmap";
import "react-calendar-heatmap/dist/styles.css";
import tippy from "tippy.js";
import "tippy.js/dist/tippy.css";
import SubmissionApi from "../../getApi/SubmissionApi";
import { convertUnixTimestamp } from "../../utils/dateUtils";
const CommitGrid = ({ author, day_of_register }) => {
  const { t } = useTranslation();
  // Get today's date
  let today = new Date();
  // Calculate the date "n" days before today
  let dayLastYear = new Date(today);
  let dayLastMonth = new Date(today);
  dayLastYear.setDate(today.getDate() - 365);
  dayLastMonth.setDate(today.getDate() - 30);
  let active = new Map();
  const [years, setYears] = useState([new Date().getFullYear()]);
  const [commit, setCommit] = useState([]);
  const [problemAllTime, setProblemAllTime] = useState(0);
  const [problemLastYear, setProblemLastYear] = useState(0);
  const [problemLastMonth, setProblemLastMonth] = useState(0);
  const [startDate, setStartDate] = useState(
    new Date().setDate(new Date().getDate() - 365)
  );
  const [endDate, setEndDate] = useState(new Date());
  const handleChange = () => {
    let value = +document.getElementById("chooseyear").value;
    if (value === 0) {
      setStartDate(new Date().setDate(new Date().getDate() - 365));
      setEndDate(new Date());
    } else {
      let year = new Date().getFullYear();
      setStartDate(new Date(`${year - value + 1}-01-01`));
      setEndDate(new Date(`${year - value + 1}-12-31`));
    }
  };
  useEffect(() => {
    let y = [];
    const registerYear = new Date(day_of_register * 1000).getFullYear(); // Convert Unix timestamp to year
    for (let i = new Date().getFullYear(); i >= registerYear; i--) {
      y.push(i);
    }
    setYears(y);
    async function fetchData() {
      return await SubmissionApi.getByAuthorAndDateRange(
        author,
        convertUnixTimestamp(day_of_register)?.toISOString(),
        new Date().toISOString()
      );
    }
    fetchData().then((rs) => {
      let data = rs?.data?.data;
      console.log(data);
      if (data) {
        let problems = new Set();
        let problemsYear = new Set();
        let problemsMonth = new Set();
        for (let i = 0; i < data.length; i++) {
          if (active.has(data[i].sent.slice(0, 10))) {
            active.set(
              data[i].sent.slice(0, 10),
              active.get(data[i].sent.slice(0, 10)) + 1
            );
          } else {
            active.set(data[i].sent.slice(0, 10), 1);
          }
          if (data[i].verdict === "ACCEPT") {
            problems.add(data[i].problem);
            if (new Date(data[i].sent) >= dayLastMonth) {
              problemsMonth.add(data[i].problem);
            }
            if (new Date(data[i].sent) >= dayLastYear) {
              problemsYear.add(data[i].problem);
            }
          }
        }
        let cnt = [];
        active.forEach((value, key) => cnt.push({ date: key, count: value }));
        setCommit(cnt);
        setProblemAllTime(problems.size);
        setProblemLastMonth(problemsMonth.size);
        setProblemLastYear(problemsYear.size);
      }
    });
  }, [author]);

  const handleMouseEnter = (event, value) => {
    if (value !== null && value.date != null) {
      tippy(event.target, {
        content: `${value.date.replaceAll("-", "/")}`,
        placement: "top",
      });
    }
  };
  return (
    <div className="w-full">
      <div className="text-right my-3">
        <select
          onChange={handleChange}
          id="chooseyear"
          className="border-solid border-black border-[1px] rounded-sm"
        >
          <option value={0}>{t("commitGrid.chooseYear")}</option>
          {years?.map((year, i) => (
            <option key={i} value={i + 1}>
              {year}
            </option>
          ))}
        </select>
      </div>
      <div className="">
        <CalendarHeatmap
          startDate={startDate}
          endDate={endDate}
          showWeekdayLabels={true}
          onMouseOver={(event, value) => handleMouseEnter(event, value)}
          values={commit}
          classForValue={(value) => {
            if (!value) {
              return "color-empty";
            }
            if (value.count == 1) return "color-scale-1";
            if (value.count == 2) return "color-scale-2";
            return "color-scale-3";
          }}
        />
      </div>

      <div className="flex">
        <div className="w-1/3 text-center">
          <h2 className="text-[30px]">{`${problemAllTime} ${t(
            "commitGrid.problems"
          )}`}</h2>
          <p>{t("commitGrid.allTime")}</p>
        </div>
        <div className="w-1/3 text-center">
          <h2 className="text-[30px]">{`${problemLastYear} ${t(
            "commitGrid.problems"
          )}`}</h2>
          <p>{t("commitGrid.lastYear")}</p>
        </div>
        <div className="w-1/3 text-center">
          <h2 className="text-[30px]">{`${problemLastMonth} ${t(
            "commitGrid.problems"
          )}`}</h2>
          <p>{t("commitGrid.lastMonth")}</p>
        </div>
      </div>
    </div>
  );
};

export default CommitGrid;
