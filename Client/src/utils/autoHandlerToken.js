import HandleCookies from "./HandleCookies";
import UserApi from "../getApi/UserApi";
const handleTokenAutomatically = async () => {
  if (!HandleCookies.checkCookie("refreshToken")) {
    return false;
  }
  if (!HandleCookies.checkCookie("accessToken")) {
    const rs = await UserApi.refreshAccessToken(
      HandleCookies.getCookie("refreshToken")
    );
    console.log(rs);
  }
  return true;
};

export default handleTokenAutomatically;
