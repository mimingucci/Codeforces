import { useEffect, useState } from "react";
import BlogApi from "../../getApi/BlogApi";
import Blog from "./Blog";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const Blogs = () => {
  const [blogs, setBlogs] = useState([]);
  useEffect(() => {
    BlogApi.getAllBlogs().then((res) => {
      setBlogs(res.data.data);
    });
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
