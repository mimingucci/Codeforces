import React, { useRef, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import BlogApi from "../getApi/BlogApi";

const RichTextInput = () => {
  const [text, setText] = useState("");
  const [title, setTitle] = useState("");
  const ref = useRef();
  const handleChange = (value) => {
    setText(value);
    console.log(title);
  };

  const handleChangeTitle = (e) => {
    setTitle(e.target.value);
  };
  const handleSubmit = async () => {
    try {
      const res = await BlogApi.createBlog({
        title,
        content: text,
        author: "66504756a3a46397d657163b",
      });
      console.log(res);
      alert("Your blog created success");
      setTitle("");
      setText("");
      ref.current.value = "";
    } catch (err) {
      alert("Oww! Something wrong");
    }
  };

  return (
    <div className="w-full mt-3">
      <h1 className="text-lg">Write Blog</h1>
      <div className="flex items-center gap-3 my-10">
        <h3 className="text-left">Title:</h3>
        <input
          type="text"
          className="border-[2px] border-solid border-black rounded-md"
          onChange={handleChangeTitle}
          ref={ref}
        ></input>
      </div>
      <div className="items-center my-10">
        <ReactQuill
          theme="snow"
          value={text}
          onChange={handleChange}
          placeholder="Enter context"
          className="w-[600px] mx-auto"
        />
      </div>

      <div className="col-md-3">
        <button
          className="btn btn-block btn-primary btn-lg bg-blue-500 rounded-sm px-5 py-3 text-white mt-[10px]"
          type="submit"
          onClick={handleSubmit}
        >
          Post
        </button>
      </div>
    </div>
  );
};

export default RichTextInput;
