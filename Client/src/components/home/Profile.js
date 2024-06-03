import icons from "../../utils/icons";
import { useEffect, useState } from "react";
import UserApi from "../../getApi/UserApi";
import { useLocation, useParams } from "react-router-dom";
import HandleCookies from "../../utils/HandleCookies";
const {
  IoIosChatboxes,
  IoIosSettings,
  IoDocumentText,
  MdEmail,
  FaStar,
  BsCalendar2DateFill,
  FaLocationDot,
  FaChartLine,
} = icons;
let ishome = true;
const Profile = () => {
  const [user, setUser] = useState();
  const params = useParams();
  //    console.log(location?.pathname?.split('/')[2])
  useEffect(() => {
    UserApi.getUserByUsername(params.username)
      .then((res) => {
        setUser(res?.data?.data);
      })
      .catch((err) => console.log(err));
    // const nickname = HandleCookies.getCookie("nickname");
    // if (nickname == null || nickname.length == 0) {
    ishome = false;
    // }
  }, []);
  return (
    <div className="w-full">
      <div className="border-[2px] rounded-md border-solid mt-[15px] mr-5 border-gray-300 text-left p-3">
        {/* <h1 className="text-[20px] text-blue-800 font-bold">Nanny</h1>             */}
        <h1 className="text-[20px] text-blue-800 font-bold">Expert</h1>
        <h1 className="text-[20px] text-blue-800 font-bold">
          {user?.username || "Username"}
        </h1>
        <p
          className={
            user?.fullname == null || user?.fullname.length == 0
              ? "hidden"
              : "text-gray-600"
          }
        >
          {user?.fullname || "Fullname"}
        </p>
        <div className="flex items-center">
          <FaChartLine className="mr-[5px]" />
          <span>Rating: {user?.rating || 0}</span>
        </div>
        <div className="flex items-center">
          <FaLocationDot className="mr-[5px]" />
          Location:{" "}
          <span className="ml-[5px] underline hover:cursor-pointer">Hanoi</span>
          ,{" "}
          <span className="ml-[5px] underline hover:cursor-pointer">
            Vietnam
          </span>
        </div>
        {/* <div className="flex items-center">
          <FaStar className="mr-[5px]" />
          Contribution:{" "}
          <span className="ml-[5px] text-green-600 font-bold">
            {user?.reviews.length || 0}
          </span>
        </div> */}
        <div className={ishome == false ? "hidden" : "flex items-center"}>
          <IoIosSettings className="mr-[5px]" />
          <span className=" underline hover:cursor-pointer">
            <a href={"/setting"}>Change settings</a>
          </span>
        </div>
        <div className="flex items-center">
          <MdEmail className="mr-[5px]" />
          <span>{user?.email || "email"}</span>
        </div>
        <div className="flex items-center">
          <BsCalendar2DateFill className="mr-[5px]" />
          <span>Registered: {user?.createdAt.slice(0, 10) || "time"}</span>
        </div>
        <div className={ishome == false ? "hidden" : "flex items-center"}>
          <IoDocumentText className="mr-[5px]" />
          <span className="underline hover:cursor-pointer">
            <a href="/writepost">Write post</a>
          </span>
        </div>
        <div className={ishome == true ? "hidden" : "flex items-center"}>
          <IoIosChatboxes className="mr-[5px]" />
          <span className="underline hover:cursor-pointer">
            <a href={"/message/" + user?.username}>Message</a>
          </span>
        </div>
      </div>
    </div>
  );
};
export default Profile;
