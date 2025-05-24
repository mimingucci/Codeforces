import HandleCookies from "./HandleCookies";
import UserApi from "../getApi/UserApi";
const handleTokenAutomatically = async () => {
  if (!HandleCookies.checkCookie("accessToken")) {
    return false;
  }
  return true;
};

export default handleTokenAutomatically;
