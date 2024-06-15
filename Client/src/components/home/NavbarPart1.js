import icons from "../../utils/icons";
import HandleCookies from "../../utils/HandleCookies";
import { useEffect, useState } from "react";
import UserApi from "../../getApi/UserApi";
const { FaArrowRightLong, FaStar, GoDotFill } = icons;
let user = "";
const NavbarPart1 = () => {
  const [detain, setDetain] = useState();
  const checkLogin = () => {
    if (HandleCookies.getCookie("username")?.length > 0) {
      user = HandleCookies.getCookie("username");
      return true;
    } else {
      return false;
    }
  };
  const getDetainUser = () => {
    UserApi.getUserByUsername(user).then((res) => setDetain(res?.data?.data));
  };
  useEffect(() => {
    if (checkLogin()) {
      getDetainUser();
    }
  }, []);
  return (
    <div>
      {checkLogin() && (
        <div className="w-full border-[2px] rounded-t-md border-solid border-gray-400 mt-4">
          <div className="flex items-center text-blue-800">
            <FaArrowRightLong size={20} className="mx-[5px] " />
            {detain?.username || "Username"}
          </div>
          <hr />
          <div className="flex">
            <div className="w-[60%]">
              <div className="flex items-center">
                <FaStar size={14} className="mx-[5px] text-blue-800" />
                Rating: {detain?.rating || "0"}
              </div>
              <div className="flex items-center">
                <GoDotFill size={14} className="mx-[5px] text-blue-800" />
                <a href={`/setting/${detain?.username}`}>Settings</a>
              </div>
              <div className="flex items-center">
                <GoDotFill size={14} className="mx-[5px] text-blue-800" />
                <a href={`/userblog/${detain?.username}`}>Blogs</a>
              </div>
              <div className="flex items-center">
                <GoDotFill size={14} className="mx-[5px] text-blue-800" />
                <a href="/usertalk">Talks</a>
              </div>
            </div>
            <div className="w-[40%] items-center flex justify-center">
              <a href={`/profile/${detain?.username}`}>
                <img src={detain?.avatar} className="w-[65%]" />
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default NavbarPart1;
