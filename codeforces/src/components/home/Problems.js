import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import { useEffect, useState } from "react";
import ProblemApi from "../../getApi/ProblemApi";
import UserApi from "../../getApi/UserApi";
import { useSearchParams, useNavigate } from "react-router-dom";
import Ranking from "./Ranking";

const Problems = ({ userPage = false }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const page = +searchParams.get("page");
  const [problems, setProblems] = useState([]);
  const [pages, setPages] = useState(0);
  useEffect(() => {
    if (!userPage) {
      ProblemApi.getProblems({ page })
        .then((rs) => {
          setProblems(rs?.data?.data?.content);
          setPages(rs?.data?.totalPages);
        })
        .catch((err) => console.err(err));
    } else {
      UserApi.getTopUsers({ field: "-rating" })
        .then((rs) => {
          setProblems(rs?.data?.data);
        })
        .catch((err) => console.err(err));
    }
  }, [page]);
  const handleChangePage = (e, p) => {
    let nxtPage = Math.max(0, p);
    nxtPage = Math.min(pages, nxtPage);
    navigate("/problems?page=" + nxtPage, { replace: true });
    page = nxtPage;
  };
  return (
    <div
      className={`w-auto border-[2px] rounded-t-md border-solid border-gray-400 mt-4 ${
        userPage ? "mr-5" : ""
      }`}
    >
      <div className="flex items-center bg-gray-200 h-5"></div>
      <hr />
      <div>
        <table className="table-auto w-full border-collapse border border-slate-300">
          <thead>
            <tr>
              <th className="border border-slate-300">#</th>
              <th className="border border-slate-300">
                {userPage ? "User" : "Problem"}
              </th>
              <th className="border border-slate-300">Rating</th>
              {!userPage && <th className="border border-slate-300">Tries</th>}
            </tr>
          </thead>
          <tbody>
            {problems &&
              problems.map((problem, index) => {
                return (
                  <tr className="odd:bg-gray-100">
                    <td className="border border-slate-300">{index + 1}</td>
                    <td className="border border-slate-300">
                      {!userPage && (
                        <a href={"/problem/" + problem.id}>{problem.title}</a>
                      )}
                      {userPage && (
                        <a href={"/profile/" + problem.author}>
                          {/* {problem.username} */}
                          <Ranking
                            username={problem?.username}
                            rating={problem?.rating}
                            title={false}
                          />
                        </a>
                      )}
                    </td>
                    <td className="border border-slate-300">
                      {problem?.rating}
                    </td>
                    {!userPage && (
                      <td className="border border-slate-300">
                        {problem?.submissions?.length}
                      </td>
                    )}
                  </tr>
                );
              })}
          </tbody>
        </table>
        <div className="items-center bg-gray-200 text-blue-800">
          {!userPage && (
            <div className="w-full items-center flex justify-center">
              <Stack spacing={2}>
                <Pagination
                  count={pages}
                  page={page}
                  onChange={handleChangePage}
                />
              </Stack>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Problems;
