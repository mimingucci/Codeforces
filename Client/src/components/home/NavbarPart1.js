import icons from "../../utils/icons";
import HandleCookies from "../../utils/HandleCookies";
import { useEffect, useState } from "react";
import UserApi from "../../getApi/UserApi";
const { FaArrowRightLong, FaStar, GoDotFill } = icons;
let user = "";
const NavbarPart1 = () => {
  const [detain, setDetain] = useState();
  const checkLogin = () => {
    if (HandleCookies.getCookie("nickname")?.length > 0) {
      user = HandleCookies.getCookie("nickname");
      return true;
    } else {
      return false;
    }
  };
  const getDetainUser = () => {
    UserApi.getUserByNickname(user).then((res) => setDetain(res?.data));
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
            {detain?.nickname || "Nickname"}
          </div>
          <hr />
          <div>
            <div className="flex items-center">
              <FaStar size={14} className="mx-[5px] text-blue-800" />
              Contribution: {detain?.posts?.length || "0"}
            </div>
            <div className="flex items-center">
              <GoDotFill size={14} className="mx-[5px] text-blue-800" />
              Settings
            </div>
            <div className="flex items-center">
              <GoDotFill size={14} className="mx-[5px] text-blue-800" />
              Blogs
            </div>
            <div className="flex items-center">
              <GoDotFill size={14} className="mx-[5px] text-blue-800" />
              Talks
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default NavbarPart1;
