import React, { useRef, useState, useCallback } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import BlogApi from "../getApi/BlogApi";
import axios from "axios";
import HandleCookies from "../utils/HandleCookies";

const RichTextInput = () => {
  const BASE_URL = "http://localhost:1234/api/image";
  const [text, setText] = useState("");
  const [title, setTitle] = useState("");
  const ref = useRef();
  const quillRef = useRef(null);

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
        accessToken: HandleCookies.getCookie("accessToken"),
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
          ref={quillRef}
          theme="snow"
          value={text}
          onChange={handleChange}
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
