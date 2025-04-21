import React from "react";
import { classnames } from "../general";
import Editor from "@monaco-editor/react";

const OutputIde = ({ outputDetails, theme }) => {
  const getOutput = () => {
    let statusId = outputDetails?.status?.id;

    if (statusId === 6) {
      // compilation error
      return `${atob(outputDetails?.compile_output)}`;
    } else if (statusId === 3) {
      if (atob(outputDetails.stdout) !== null) {
        return `Verdict: ${outputDetails?.status?.description} \nTime: ${
          outputDetails?.time * 1000
        } ms \nMemory: ${outputDetails?.memory} KB\n${atob(
          outputDetails.stdout
        )}`;
      } else {
        return "";
      }
    } else if (statusId === 5) {
      return "Time Limit Exceeded";
    } else {
      return `${atob(outputDetails?.stderr)}`;
    }
  };
  return (
    <>
      <Editor
        theme={theme}
        value={outputDetails ? getOutput() : ""}
        defaultValue="//Output"
      />
    </>
  );
};

export default OutputIde;
