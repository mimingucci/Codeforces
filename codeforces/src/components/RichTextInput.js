import React, { useRef, useState, useCallback, useEffect } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import BlogApi from "../getApi/BlogApi";
import axios from "axios";
import HandleCookies from "../utils/HandleCookies";
import TagsInput from "./TagsInput";
import handleTokenAutomatically from "../utils/autoHandlerToken";
import { ToastContainer, toast } from "react-toastify";
import { useLoading } from "./shared/LoadingContext";
import LoadingButton from './shared/LoadingButton';
import "react-toastify/dist/ReactToastify.css";
import { 
  Paper, 
  Typography, 
  TextField, 
  Container, 
  Box,
} from '@mui/material';
import PostAddIcon from '@mui/icons-material/PostAdd';
import UpdateIcon from '@mui/icons-material/Update';

const RichTextInput = ({ blogid = "-1" }) => {
  const BASE_URL = "http://localhost:8080/api/v1/blog/upload";
  const [text, setText] = useState("");
  const [title, setTitle] = useState("");
  const [tags, setTags] = useState([]);
  const [id, setId] = useState(blogid);
  const [blog, setBlog] = useState({});
  const ref = useRef();
  const quillRef = useRef(null);
  // const { setLoading } = useLoading();
  const[loading, setLoading] = useState(false);

  useEffect(() => {
    if (id === "-1") {
      setBlog({});
    } else {
      const fetchData = async () => {
        const rs = await BlogApi.getBlogById({
          id,
        });
        return rs.data.data;
      };
      fetchData().then((rs) => {
        setBlog(rs);
        setTags(rs?.tags);
      });
    }
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
        accessToken: HandleCookies.getCookie("token"),
      });
      showSuccessToast("Blog updated successfully");
      // setId(result.data.data._id);
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
    setLoading(true);
    try {
      const rs = await axios.post(BASE_URL, formData, {
        headers: {
          Authorization: "Bearer " + HandleCookies.getCookie("token"),
        },
      });
      return rs?.data?.data;  
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (value) => {
    setText(value);
  };

  const handleChangeTitle = (e) => {
    setTitle(e.target.value);
  };
  const handleSubmit = async () => {
    try {
      const res = await BlogApi.createBlog({
        blog: { title, content: text, tags },
        accessToken: HandleCookies.getCookie("token"),
      });
      showSuccessToast("Your blog created success");
      setId(res.data.data.id);
    } catch (err) {
      showErrorToast("Oww! Something wrong");
    }
  };

  return (
    <Container maxWidth="lg">
      <Paper elevation={3} sx={{ p: 4, mt: 3 }}>
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
        
        <Typography variant="h5" gutterBottom>
          Write Blog
        </Typography>

        <Box sx={{ my: 4 }}>
          <TextField
            label="Title"
            variant="outlined"
            fullWidth
            onChange={handleChangeTitle}
            inputRef={ref}
            sx={{ mb: 4 }}
          />

        <Box sx={{ mb: 4 }}>
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
              className="w-full mx-auto"
            />
          </Box>

          <Box sx={{ mb: 4 }}>
            <Typography variant="subtitle1" sx={{ mb: 1 }}>
              Tags
            </Typography>
            <TagsInput 
              active={true} 
              initTags={tags} 
              setTags={setTags} 
            />
          </Box>

          <Box sx={{ display: 'flex', gap: 2 }}>
            <LoadingButton
              loading={loading}
              onClick={id !== "-1" ? handleUpdate : handleSubmit}
              variant="contained"
              startIcon={id !== "-1" ? <UpdateIcon /> : <PostAddIcon />}
              size="large"
            >
              {id !== "-1" ? "Update" : "Post"}
            </LoadingButton>
          </Box>
        </Box>
      </Paper>
    </Container>
  )  
};

export default RichTextInput;
