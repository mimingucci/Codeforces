import React from "react";
import { classnames } from "../general";

const OutputWindow = ({
  outputDetails,
  sampleoutput = null,
  setEnableSubmit,
}) => {
  const getOutput = () => {
    let statusId = outputDetails?.status?.id;

    if (statusId === 6) {
      // compilation error
      return (
        <pre className="px-2 py-1 font-normal text-xs text-red-500 text-left">
          {atob(outputDetails?.compile_output)}
        </pre>
      );
    } else if (statusId === 3) {
      if (
        !sampleoutput ||
        !sampleoutput?.length ||
        atob(outputDetails.stdout) === null
      )
        return (
          <pre className="px-2 py-1 font-normal text-xs text-green-500 text-left">
            {atob(outputDetails.stdout) !== null
              ? `Verdict: ${outputDetails?.status?.description} \nTime: ${
                  outputDetails?.time * 1000
                } ms \nMemory: ${outputDetails?.memory} KB\n${atob(
                  outputDetails.stdout
                )}`
              : null}
          </pre>
        );
      const answer = sampleoutput
        .trim()
        .split(" ")
        .filter((syntax) => syntax !== "");
      const participant = atob(outputDetails.stdout)
        .trim()
        .split(" ")
        .filter((syntax) => syntax !== "");
      if (answer.length !== participant.length) {
        return (
          <pre className="px-2 py-1 font-normal text-xs text-red-500 text-left">
            {`Verdict: Wrong Answer \nTime ${
              outputDetails?.time * 1000
            } ms \nMemory: ${outputDetails?.memory} KB \nUser's Output: ${atob(
              outputDetails.stdout
            )}Expected Answer: ${sampleoutput}`}
          </pre>
        );
      }
      let isCorrect = true;
      for (let i = 0; i < answer.length && isCorrect; i++) {
        if (answer[i] !== participant[i]) {
          isCorrect = false;
        }
      }
      if (!isCorrect) {
        setEnableSubmit(false);
        return (
          <pre className="px-2 py-1 font-normal text-xs text-red-500 text-left">
            {`Verdict: Wrong Answer \nTime ${
              outputDetails?.time * 1000
            } ms \nMemory: ${outputDetails?.memory} KB \nUser's Output: ${atob(
              outputDetails.stdout
            )}Expected Answer: ${sampleoutput}`}
          </pre>
        );
      } else {
        setEnableSubmit(true);
        return (
          <pre className="px-2 py-1 font-normal text-xs text-green-500 text-left">
            {atob(outputDetails.stdout) !== null
              ? `Verdict: ${outputDetails?.status?.description} \nTime: ${
                  outputDetails?.time * 1000
                } ms \nMemory: ${outputDetails?.memory} KB\n${atob(
                  outputDetails.stdout
                )}`
              : null}
          </pre>
        );
      }
    } else if (statusId === 5) {
      setEnableSubmit(false);

      return (
        <pre className="px-2 py-1 font-normal text-xs text-red-500 text-left">
          {`Time Limit Exceeded`}
        </pre>
      );
    } else {
      setEnableSubmit(false);

      return (
        <pre className="px-2 py-1 font-normal text-xs text-red-500 text-left">
          {atob(outputDetails?.stderr)}
        </pre>
      );
    }
  };
  return (
    <>
      <h1 className="mt-3 text-left font-bold text-xl bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-700 mb-2">
        Output
      </h1>
      <div className="w-full border-2 border-black z-10 rounded-md shadow-[5px_5px_0px_0px_rgba(0,0,0)] px-4 py-2 hover:shadow transition duration-200 bg-[#1e293b] mt-2 h-full overflow-hidden">
        {outputDetails ? <>{getOutput()}</> : null}
      </div>
    </>
  );
};

export default OutputWindow;
