import React, { useEffect, useRef, useState, useCallback } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import TagsInput from "../TagsInput";
import "@vaadin/split-layout";
import ProblemApi from "../../getApi/ProblemApi";
import HandleCookies from "../../utils/HandleCookies";
import handleTokenAutomatically from "../../utils/autoHandlerToken";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
const CreateProblem = ({ problemid = "-1" }) => {
  const BASE_URL = "http://localhost:1234/api/image";
  const [tags, setTags] = useState([]);
  const [id, setId] = useState(problemid);
  const [problem, setProblem] = useState({});
  const quillRef = useRef(null);
  const [solution, setSolution] = useState("");
  const navigate = useNavigate();
  useEffect(() => {
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
        tags,
        solution,
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

  const handleUpdate = () => {
    navigate("/editproblem/" + id);
  };

  const imageHandler = useCallback(() => {
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");
    input.click();
    input.onchange = async () => {
      if (input !== null && input.files !== null) {
        const file = input.files[0];
        const url = await uploadToCloudinary(file);
        const quill = quillRef.current;
        if (quill) {
          const range = quill.getEditorSelection();
          range && quill.getEditor().insertEmbed(range.index, "image", url);
        }
      }
    };
  }, []);

  const uploadToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append("image", file);
    const rs = await axios.post(BASE_URL, formData, {
      headers: {
        Authorization: "Bearer " + HandleCookies.getCookie("accessToken"),
      },
    });
    console.log(rs?.data?.data);
    return rs?.data?.data;
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
          ref={quillRef}
          theme="snow"
          value={statement}
          onChange={handleChangeStatement}
          placeholder="Enter context"
          modules={{
            toolbar: {
              container: [
                [{ header: "1" }, { header: "2" }, { font: [] }],
                [{ size: [] }],
                ["bold", "italic", "underline", "strike", "blockquote"],
                [
                  { list: "ordered" },
                  { list: "bullet" },
                  { indent: "-1" },
                  { indent: "+1" },
                ],
                ["link", "image", "video"],
                ["code-block"],
                ["clean"],
              ],
              handlers: {
                image: imageHandler,
              },
            },
            clipboard: {
              matchVisual: false,
            },
          }}
          formats={[
            "header",
            "font",
            "size",
            "bold",
            "italic",
            "underline",
            "strike",
            "blockquote",
            "list",
            "bullet",
            "indent",
            "link",
            "image",
            "video",
            "code-block",
          ]}
          className="w-full mx-auto px-5"
        />
      </div>
      <div className="items-center my-10">
        <h3 className="text-left">Sample Test Case:</h3>
        <div className="border-solid border-gray-300 border-2 mx-5">
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
      <div className="flex items-center gap-3 my-10">
        <h3 className="text-left">Add Tag:</h3>
        <TagsInput active={true} initTags={tags} setTags={setTags} />
      </div>
      <div className="flex items-center gap-3 my-10">
        <h3 className="text-left w-[167px]">Solution:</h3>
        <input
          type="text"
          value={solution}
          className="border-[2px] border-solid border-black rounded-md"
          onChange={(e) => setSolution(e.target.value)}
        ></input>
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
          onClick={() => window.location.replace("/createproblem")}
        >
          New
        </button>
      </div>
    </div>
  );
};

export default CreateProblem;
