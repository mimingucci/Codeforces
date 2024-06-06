import React, { useEffect, useRef, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import "@vaadin/split-layout";
import ProblemApi from "../../getApi/ProblemApi";
import HandleCookies from "../../utils/HandleCookies";
import handleTokenAutomatically from "../../utils/autoHandlerToken";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import TestCaseApi from "../../getApi/TestCaseApi";

const CreateProblem = ({ problemid = "-1" }) => {
  const [id, setId] = useState(problemid);
  const [problem, setProblem] = useState({});
  useEffect(() => {
    console.log("run here");
    if (id === "-1") {
      setProblem({});
    } else {
      const fetchData = async () => {
        const rs = await ProblemApi.getProblem({
          id,
          accessToken: HandleCookies.getCookie("accessToken"),
        });
        return rs.data.data;
      };
      fetchData().then((rs) => setProblem(rs));
    }
  }, [id]);
  const [statement, setStatement] = useState("");
  const [title, setTitle] = useState("");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [timelimit, setTimelimit] = useState("");
  const [memorylimit, setMemorylimit] = useState("");
  const handleChangeStatement = (value) => {
    setStatement(value);
  };

  const handleChangeInput = (e) => {
    setInput(e.target.value);
  };

  const handleChangeOutput = (e) => {
    setOutput(e.target.value);
  };

  const handleChangeTitle = (e) => {
    setTitle(e.target.value);
  };

  const handleChangeTimelimit = (e) => {
    setTimelimit(e.target.value);
  };

  const handleChangeMemorylimit = (e) => {
    setMemorylimit(e.target.value);
  };

  const showSuccessToast = (msg) => {
    toast.success(msg || `Compiled Successfully!`, {
      position: "top-right",
      autoClose: 1000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  };
  const showErrorToast = (msg, timer) => {
    toast.error(msg || `Something went wrong! Please try again.`, {
      position: "top-right",
      autoClose: timer ? timer : 1000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  };

  const handleSubmit = async () => {
    try {
      const valid = await handleTokenAutomatically();
      if (!valid) {
        showErrorToast("Please login to create your own problem");
        return;
      }
      if (
        !title ||
        !statement ||
        !timelimit ||
        !memorylimit ||
        !input ||
        !output
      ) {
        showErrorToast("Please fill out all the required info");
        return;
      }
      const rs = await ProblemApi.create({
        title,
        statement,
        timelimit,
        memorylimit,
        accessToken: HandleCookies.getCookie("accessToken"),
      });
      const result = await ProblemApi.addTestCase({
        problem: rs.data.data._id,
        input,
        output,
        accessToken: HandleCookies.getCookie("accessToken"),
      });
      showSuccessToast("Problem created successfully");
      setId(result.data.data._id);
    } catch (err) {
      alert("Oww! Something wrong");
    }
  };

  const handleUpdate = async () => {
    try {
      const valid = await handleTokenAutomatically();
      if (!valid) {
        showErrorToast("Please login to create your own problem");
        return;
      }
      if (
        !title ||
        !statement ||
        !timelimit ||
        !memorylimit ||
        !input ||
        !output
      ) {
        showErrorToast("Please fill out all the required info");
        return;
      }
      const rs = await ProblemApi.update({
        id: problem._id,
        title,
        statement,
        timelimit,
        memorylimit,
        accessToken: HandleCookies.getCookie("accessToken"),
      });
      const result = await TestCaseApi.update({
        id: problem.testcases[0]._id,
        input,
        output,
        accessToken: HandleCookies.getCookie("accessToken"),
      });
      showSuccessToast("Problem updated successfully");
      // setId(result.data.data._id);
    } catch (err) {
      alert("Oww! Something wrong");
    }
  };

  return (
    <div className="w-full mt-3">
      <ToastContainer
        position="top-center"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <h1 className="text-lg">
        {id !== "-1" ? "View Problem" : "Create New Problem"}
      </h1>
      <div className="flex items-center gap-3 my-10">
        <h3 className="text-left w-[167px]">Name Problem:</h3>
        <input
          type="text"
          className="border-[2px] border-solid border-black rounded-md"
          onChange={handleChangeTitle}
        ></input>
      </div>
      <div className="flex items-center gap-3 my-10">
        <h3 className="text-left w-[167px]">Time Limit:</h3>
        <input
          type="number"
          className="border-[2px] border-solid border-black rounded-md"
          onChange={handleChangeTimelimit}
        ></input>
      </div>
      <div className="flex items-center gap-3 my-10">
        <h3 className="text-left w-[167px]">Memory Limit:</h3>
        <input
          type="number"
          className="border-[2px] border-solid border-black rounded-md"
          onChange={handleChangeMemorylimit}
        ></input>
      </div>
      <div className="items-center my-10">
        <h3 className="text-left">Statement:</h3>
        <ReactQuill
          theme="snow"
          value={statement}
          onChange={handleChangeStatement}
          placeholder="Enter context"
          className="w-[600px] mx-auto"
        />
      </div>
      <div className="items-center my-10">
        <h3 className="text-left">Sample Test Case:</h3>
        <div className="border-solid border-gray-300 border-2">
          <vaadin-split-layout>
            <div>
              <textarea
                placeholder="Input"
                onChange={handleChangeInput}
              ></textarea>
            </div>
            <div>
              <textarea
                placeholder="Output"
                onChange={handleChangeOutput}
              ></textarea>
            </div>
          </vaadin-split-layout>
        </div>
      </div>
      <div className="col-md-3">
        <button
          className="btn btn-block btn-primary btn-lg bg-blue-500 rounded-sm px-5 py-3 text-white mt-[10px]"
          type="submit"
          onClick={id !== "-1" ? handleUpdate : handleSubmit}
        >
          {id !== "-1" ? "Update" : "Create"}
        </button>
        <button
          className={`btn btn-block btn-primary btn-lg bg-blue-500 rounded-sm px-5 py-3 text-white mt-[10px] ml-5 ${
            id !== "-1" ? "" : "hidden"
          }`}
          // type="submit"
          onClick={() => window.location.replace("/createproblem")}
        >
          New
        </button>
      </div>
    </div>
  );
};

export default CreateProblem;
