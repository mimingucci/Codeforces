import { useEffect, useState } from "react";
import logo from "../assets/image/Codeforces_logo.svg.png";
import icons from "../utils/icons";
import UserApi from "../getApi/UserApi";
import { redirect } from "react-router-dom";
import HandleCookies from "../utils/HandleCookies";
import handleTokenAutomatically from "../utils/autoHandlerToken";
const { IoIosNotifications, IoMdSearch } = icons;
const Header = () => {
  let user = "";
  const [value, setValue] = useState();
  const handleClick = () => {
    const keyword = value;
    setValue("");
    window.location.replace("/search?query=" + keyword);
  };
  const checkLogin = () => {
    if (HandleCookies.getCookie("username")?.length > 0) {
      user = HandleCookies.getCookie("username");
      return true;
    } else {
      return false;
    }
  };
  const handleLogout = async () => {
    user = "";
    const rs = await UserApi.logout(HandleCookies.getCookie("refreshToken"));
    console.log(rs);
    HandleCookies.setCookie("accessToken", "", 0);
    HandleCookies.setCookie("refreshToken", "", 0);
    HandleCookies.setCookie("username", "", 0);
    window.location.replace("/");
  };
  useEffect(() => {
    checkLogin();
  }, [user]);
  return (
    <div>
      <div className="upper_header flex justify-between mb-3">
        <div className="w-[300px]">
          <a href="http://localhost:3000/">
            <img src={logo} className="w-full" />
          </a>
        </div>
        <div className="text-center">
          <div className="relative block">
            <IoIosNotifications
              size={20}
              className="mx-auto absolute right-0"
            />
          </div>
          <div className="underline mt-[15px]">
            {checkLogin() && (
              <a href={"http://localhost:3000/profile/" + user} className="">
                {user}
              </a>
            )}
            {checkLogin() && (
              <span onClick={handleLogout} className="hover:cursor-pointer">
                | Logout
              </span>
            )}
            {!checkLogin() && <a href="http://localhost:3000/login">Login</a>}
          </div>
        </div>
      </div>
      <div className="downer_header border-r-[50%] rounded-md border-2 w-full h-[50px] border-gray-400 border-solid justify-between flex">
        <div className="w-full h-full flex space-x-4 content-center py-[10px] pl-[10px]">
          <div className="hover:cursor-pointer">
            <a href="http://localhost:3000/home">HOME</a>
          </div>
          <div className="hover:cursor-pointer">
            <a href="http://localhost:3000/ide">IDE</a>
          </div>
          <div className="hover:cursor-pointer">
            <a href="http://localhost:3000/problems?page=1">PROBLEMSET</a>
          </div>
          <div className="hover:cursor-pointer">
            <a href="http://localhost:3000/rating">TOP USER</a>
          </div>
          <div className="hover:cursor-pointer">
            <a href="http://localhost:3000/calendar">CALENDAR</a>
          </div>
          <div className="hover:cursor-pointer">
            <a href="http://localhost:3000/createproblem">CREATEPROBLEM</a>
          </div>
          <div className="hover:cursor-pointer">HELP</div>
          <div className="hover:cursor-pointer">CATALOG</div>
        </div>
        <div className="py-[10px] pr-[10px] flex">
          <IoMdSearch
            size={20}
            className="my-auto hover:cursor-pointer"
            onClick={handleClick}
          />
          <input
            // onKeyPress={handleKeyUp}
            type={"text"}
            placeholder="Search"
            className="flex-1 bg-gray-200 outline-none w-auto"
            onChange={(e) => setValue(e.target.value)}
            value={value}
          />
        </div>
      </div>
    </div>
  );
};
export default Header;
