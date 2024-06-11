import { useEffect, useState } from "react";
import icons from "../../utils/icons";
import BlogApi from "../../getApi/BlogApi";
const { FaArrowRightLong } = icons;
const NavbarPart4 = () => {
  const [blogs, setBlogs] = useState();
  useEffect(() => {
    BlogApi.recentlyActive({ page: 1 }).then((res) => setBlogs(res.data.data));
  }, []);
  return (
    <div className="w-full border-[2px] rounded-t-md border-solid border-gray-400 mt-4">
      <div className="flex items-center text-blue-800">
        <FaArrowRightLong size={20} className="mx-[5px] " />
        Recent actions
      </div>
      <hr />
      <div>
        <div>
          {blogs &&
            blogs.map((blog) => (
              <div className="flex mx-[5px] items-center" key={blog?._id}>
                <a href={`/profile/${blog?.author?.username}`}>
                  {blog?.author?.username}
                </a>
                <FaArrowRightLong size={15} className="mx-[5px]" />{" "}
                <a href={`/blog/${blog?._id}`}>{blog?.title}</a>
              </div>
            ))}
        </div>
        <div className="flex items-center bg-gray-100 text-blue-800 flex-row-reverse"></div>
      </div>
    </div>
  );
};
export default NavbarPart4;
