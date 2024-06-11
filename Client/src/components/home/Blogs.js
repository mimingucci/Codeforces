import { useEffect, useState } from "react";
import BlogApi from "../../getApi/BlogApi";
import Blog from "./Blog";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
const Blogs = ({ author = "" }) => {
  const [blogs, setBlogs] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    if (author.length === 0) {
      BlogApi.getAllBlogs()
        .then((res) => {
          if (res?.data?.status === "success") {
            setBlogs(res.data.data);
          } else {
            navigate("/error");
          }
        })
        .catch((err) => navigate("/error"));
    } else {
      BlogApi.getBlogByUsername(author)
        .then((res) => {
          if (res?.data?.status === "success") {
            setBlogs(res.data.data);
          } else {
            navigate("/error");
          }
        })
        .catch((err) => navigate("/error"));
    }
  }, []);
  return (
    <div>
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
      {blogs && blogs.map((blog) => <Blog blog={blog} key={blog._id} />)}
    </div>
  );
};
export default Blogs;
