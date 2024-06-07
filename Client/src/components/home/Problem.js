import "@vaadin/split-layout";
import Landing from "../CodeEditor/Components/Landing";
import { useEffect, useState } from "react";
import ProblemApi from "../../getApi/ProblemApi";
import ProblemNavbar from "./ProblemNavbar";

const Problem = () => {
  const [problem, setProblem] = useState(null);
  useEffect(() => {
    async function init() {
      const rs = await ProblemApi.getProblem("66613d66e910e617cab3b91e");
      if (rs?.data?.status === "success") {
        setProblem(rs.data.data);
        console.log(problem.testcases[0].input);
      }
    }
    init();
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
          />
        </div>
      ) : (
        <div>Cannot fetch problem statements</div>
      )}
      <div>
        <Landing
          sampleinput={problem?.testcases[0].input}
          sampleoutput={problem?.testcases[0].output}
        />
      </div>
    </vaadin-split-layout>
  );
};

export default Problem;
