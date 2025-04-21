import { useNavigate, useParams } from "react-router-dom";
import Blogs from "./Blogs";
import { useEffect } from "react";
import NavProfile from "./NavProfile";

const UserBlog = () => {
  const { author } = useParams();
  const navigate = useNavigate();
  useEffect(() => {
    if (!author) {
      navigate("/error");
    }
  }, []);
  return (
    <>
      <NavProfile username={author} />
      <Blogs author={author} />
    </>
  );
};

export default UserBlog;
