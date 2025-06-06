import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import SubmissionApi from "../../getApi/SubmissionApi";
import icons from "../../utils/icons";
import tippy from "tippy.js";
import "tippy.js/dist/tippy.css";
import { useTranslation } from "react-i18next";

const { FaArrowRightLong } = icons;

const SubmitDetail = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const [submission, setSubmission] = useState(null);
  const navigate = useNavigate();
  useEffect(() => {
    async function fetchData(id) {
      const rs = await SubmissionApi.getById(id);
      return rs;
    }
    fetchData(id).then((rs) => {
      if (rs?.data?.status === "success") {
        setSubmission(rs.data.data);
        console.log(rs.data.data);
      } else {
        navigate("/error");
      }
    });
  }, []);

  function handleCopy() {
    navigator.clipboard.writeText(submission?.code);
    tippy("#copyButton", {
      content: t("submitDetail.copied"),
      trigger: "click",
      duration: 300,
    }).show();
  }
  return (
    <div className="mr-5 mt-5">
      <div>
        <div className="bg-gray-300 rounded-t-md">
          {t("submitDetail.general")}
        </div>
        <table className="table-auto w-full border-collapse border border-slate-300">
          <thead>
            <tr>
              <th className="border border-slate-300">#</th>
              <th className="border border-slate-300">
                {t("submitDetail.when")}
              </th>
              <th className="border border-slate-300">
                {t("submitDetail.who")}
              </th>
              <th className="border border-slate-300">
                {t("submitDetail.problem")}
              </th>
              <th className="border border-slate-300">
                {t("submitDetail.lang")}
              </th>
              <th className="border border-slate-300">
                {t("submitDetail.verdict")}
              </th>
              <th className="border border-slate-300">
                {t("submitDetail.time")}
              </th>
              <th className="border border-slate-300">
                {t("submitDetail.memory")}
              </th>
            </tr>
          </thead>
          <tbody>
            {submission && (
              <tr className="odd:bg-gray-100">
                <td className="border border-slate-300">{submission?._id}</td>
                <td className="border border-slate-300">
                  {new Date(submission?.createdAt).toUTCString()}
                </td>
                <td className="border border-slate-300">
                  {submission?.author?.username}
                </td>
                <td className="border border-slate-300">
                  <a
                    class="under"
                    href={"/problem/" + submission?.problem?._id}
                  >
                    {submission?.problem?.title}
                  </a>
                </td>
                <td className="border border-slate-300">
                  {submission?.language}
                </td>
                <td
                  className={`border border-slate-300 ${
                    submission?.status === "Accepted"
                      ? "text-green-600 font-bold"
                      : "text-blue-800"
                  }`}
                >
                  {submission?.status}
                </td>
                <td className="border border-slate-300">
                  {submission?.time * 1000} ms
                </td>
                <td className="border border-slate-300">
                  {submission?.memory / 1000} KB
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="rounded-t-md border-solid border-[1px] border-gray-300 mt-5">
        <div className="flex justify-between">
          <div className="flex items-center text-blue-800">
            <FaArrowRightLong size={20} className="mx-[5px] " />
            {t("submitDetail.source")}
          </div>
          <div className="">
            <button
              className="px-2 border-solid border-[1px] border-gray-300 rounded-md"
              onClick={handleCopy}
              id="copyButton"
            >
              {t("submitDetail.copy")}
            </button>
          </div>
        </div>
        <div className="text-left">
          <pre id="source">{submission?.code}</pre>
        </div>
      </div>
    </div>
  );
};

export default SubmitDetail;
