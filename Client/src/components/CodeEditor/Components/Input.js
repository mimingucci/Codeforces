import React from "react";
import { classnames } from "../general";
import Editor from "@monaco-editor/react";

const Input = ({ customInput, setCustomInput }) => {
  return (
    <>
      <div className="font-bold text-xl text-left    bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-700 mb-2">
        Input
      </div>
      <textarea
        rows="5"
        value={customInput}
        onChange={(e) => setCustomInput(e.target.value)}
        placeholder={`Custom input`}
        className={classnames(
          "focus:outline-none w-full border-2 text-white border-black z-10 rounded-md shadow-[5px_5px_0px_0px_rgba(0,0,0)] px-4 py-2 hover:shadow transition duration-200 bg-[#1e293b] mt-2"
        )}
      ></textarea>
    </>
  );
};

export default Input;
