import { useEffect, useState } from "react";
import BlogApi from "../../getApi/BlogApi";
import Blog from "./Blog";
const Blogs = () => {
  const [blogs, setBlogs] = useState([]);
  useEffect(() => {
    BlogApi.getAllBlogs().then((res) => {
      console.log("Blogs->", res);
      setBlogs(res.data.data);
    });
  }, []);
  return <div>{blogs && blogs.map((blog) => <Blog blog={blog} />)}</div>;
};
export default Blogs;
