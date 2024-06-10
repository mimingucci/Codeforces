import React, { useRef, useState, useCallback, useEffect } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import BlogApi from "../../getApi/BlogApi";
import axios from "axios";
import HandleCookies from "../../utils/HandleCookies";
import TagsInput from "../TagsInput";
import handleTokenAutomatically from "../../utils/autoHandlerToken";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate, useParams } from "react-router-dom";

const EditBlog = () => {
  const BASE_URL = "http://localhost:1234/api/image";
  const [text, setText] = useState("");
  const [title, setTitle] = useState("");
  const [tags, setTags] = useState([]);
  const { id } = useParams();
  const quillRef = useRef(null);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchData = async () => {
      const rs = await BlogApi.getBlogById(id);
      return rs.data.data;
    };
    fetchData().then((rs) => {
      setTitle(rs?.title);
      setText(rs?.content);
      setTags(rs?.tags.map((i) => i.name));
    });
  }, [id]);

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

  const handleUpdate = async () => {
    try {
      const valid = await handleTokenAutomatically();
      if (!valid) {
        showErrorToast("Please login to update blog");
        return;
      }
      if (!text || !title) {
        showErrorToast("Please fill out all the required info");
        return;
      }
      const rs = await BlogApi.updateById({
        id: id,
        blog: {
          title: title,
          content: text,
          tags: tags,
        },
        accessToken: HandleCookies.getCookie("accessToken"),
      });
      showSuccessToast("Blog updated successfully");
    } catch (err) {
      showErrorToast("Oww! Something wrong");
    }
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

  const handleChange = (value) => {
    setText(value);
  };

  const handleChangeTitle = (e) => {
    setTitle(e.target.value);
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
      <h1 className="text-lg">Update Blog</h1>
      <div className="flex items-center gap-3 my-10">
        <h3 className="text-left">Title:</h3>
        <input
          type="text"
          className="border-[2px] border-solid border-black rounded-md"
          onChange={handleChangeTitle}
          value={title}
          //   ref={ref}
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
      <div className="flex items-center gap-3 my-10">
        <h3 className="text-left">Add Tag:</h3>
        <TagsInput active={true} initTags={tags} setTags={setTags} />
      </div>
      <div className="col-md-3">
        <button
          className="btn btn-block btn-primary btn-lg bg-blue-500 rounded-sm px-5 py-3 text-white mt-[10px]"
          type="submit"
          onClick={handleUpdate}
        >
          Update
        </button>
        <button
          className={`btn btn-block btn-primary btn-lg bg-blue-500 rounded-sm px-5 py-3 text-white mt-[10px] ml-5`}
          onClick={() => navigate("/writeblog")}
        >
          New
        </button>
      </div>
    </div>
  );
};

export default EditBlog;
