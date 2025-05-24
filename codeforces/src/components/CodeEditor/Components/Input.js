import React from "react";
import { classnames } from "../general";
import Editor from "@monaco-editor/react";

const Input = ({ customInput = "", setCustomInput }) => {
  return (
    <>
      <div className="font-bold text-xl text-left    bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-700 mb-2">
        Input
      </div>
      <div className="w-full border-2 border-black z-10 rounded-md shadow-[5px_5px_0px_0px_rgba(0,0,0)] px-4 py-2 hover:shadow transition duration-200 bg-[#1e293b] mt-2 h-full text-left overflow-hidden text-white">
        {customInput}
      </div>
    </>
  );
};

export default Input;
