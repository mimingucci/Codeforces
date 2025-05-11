import SubmissionApi from "../../getApi/SubmissionApi";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import { useEffect, useState } from "react";
import "../../assets/css/default.css";
import { useParams, useNavigate } from "react-router-dom";
import NavProfile from "./NavProfile";
const Submission = () => {
  const navigate = useNavigate();
  const { author, page } = useParams();
  const [submissions, setSubmissions] = useState();
  const [pages, setPages] = useState(1);

  useEffect(() => {
    // console.log(author, page);
    SubmissionApi.paging({ author, page })
      .then((rs) => {
        setSubmissions(rs?.data?.data);
        setPages(rs?.data?.numberOfPage);
      })
      .catch(() => navigate("/error"));
  }, [page]);
  const handleChangePage = (e, p) => {
    let nxtPage = Math.max(1, p);
    nxtPage = Math.min(pages, nxtPage);
    navigate("/problems?page=" + nxtPage, { replace: true });
    page = nxtPage;
  };

  return (
    <div>
      <NavProfile username={author} />
      <div>
        <h1 className="text-lg">{author} submissions</h1>
      </div>
      <div
        className={`mr-5 border-[2px] rounded-t-md border-solid border-gray-400 mt-4`}
      >
        <div className="flex items-center bg-gray-200 h-5"></div>
        <hr />
        <div>
          <table className="table-auto w-full border-collapse border border-slate-300">
            <thead>
              <tr>
                <th className="border border-slate-300">#</th>
                <th className="border border-slate-300">When</th>
                <th className="border border-slate-300">Who</th>
                <th className="border border-slate-300">Problem</th>
                <th className="border border-slate-300">Lang</th>
                <th className="border border-slate-300">Verdict</th>
                <th className="border border-slate-300">Time</th>
                <th className="border border-slate-300">Memory</th>
              </tr>
            </thead>
            <tbody>
              {submissions &&
                submissions.map((submission, index) => {
                  return (
                    <tr className="odd:bg-gray-100">
                      <td className="border border-slate-300" class="under">
                        <a href={`/submission/${submission?.id}`}>
                          {submission?.id}
                        </a>
                      </td>
                      <td className="border border-slate-300">
                        {new Date(submission?.createdAt).toUTCString()}
                      </td>
                      <td className="border border-slate-300">
                        {submission?.author.username}
                      </td>
                      <td className="border border-slate-300">
                        <a
                          class="under"
                          href={"/problem/" + submission?.problem?.id}
                        >
                          {submission?.problem.title}
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
                  );
                })}
            </tbody>
          </table>
          <div className="items-center bg-gray-200 text-blue-800">
            <div className="w-full items-center flex justify-center">
              <Stack spacing={2}>
                <Pagination
                  count={pages}
                  page={page}
                  onChange={handleChangePage}
                />
              </Stack>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Submission;
