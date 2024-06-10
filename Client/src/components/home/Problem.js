import "@vaadin/split-layout";
import Landing from "../CodeEditor/Components/Landing";
import { useEffect, useState } from "react";
import ProblemApi from "../../getApi/ProblemApi";
import ProblemNavbar from "./ProblemNavbar";
import { useParams } from "react-router-dom";

const Problem = () => {
  const [problem, setProblem] = useState(null);
  const { id } = useParams();
  useEffect(() => {
    const fetchData = async () => {
      const rs = await ProblemApi.getProblem(id);
      if (rs?.data?.status === "success") {
        setProblem(rs.data.data);
      } else {
        setProblem(null);
      }
    };
    fetchData();
  }, []);
  return (
    <vaadin-split-layout orientation="vertical">
      {problem ? (
        <div className="mt-3 flex">
          <div className="w-[75%]">
            <div>
              <h1 className="text-[25px] font-bold">{problem.title}</h1>
              <h3>time limit per test: {problem.timelimit / 1000} seconds</h3>
              <h3>
                memory limit per test: {problem.memorylimit / 1000000} megabytes
              </h3>
              <h3>input: standard input</h3>
              <h3>output: standard output</h3>
            </div>
            <div className="my-5">
              <div
                dangerouslySetInnerHTML={{ __html: problem?.statement }}
                className="text-left"
              ></div>
            </div>
          </div>
          <ProblemNavbar
            author={problem.author.username}
            likes={problem?.likes}
            dislikes={problem?.dislikes}
            tags={problem?.tags}
            rating={problem?.rating}
            submissions={problem?.submissions}
            solution={problem?.solution}
            problem={problem._id}
          />
        </div>
      ) : (
        <div>Cannot fetch problem statements</div>
      )}
      <div>
        <Landing
          sampleinput={problem?.testcases[0]?.input}
          sampleoutput={problem?.testcases[0]?.output}
          problem={problem?._id}
        />
      </div>
    </vaadin-split-layout>
  );
};

export default Problem;
