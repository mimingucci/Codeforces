import React, { useEffect, useState } from "react";
import { useParams, Navigate } from "react-router-dom";
import UserApi from "../../getApi/UserApi";
import HandleCookies from "../../utils/HandleCookies";
const LoginGoogle = () => {
  const { email, password } = useParams();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  useEffect(() => {
    UserApi.login({ email, password }).then((res) => {
      if (res?.data?.status === "success") {
        HandleCookies.setCookie("accessToken", res.data["accessToken"], 7);
        HandleCookies.setCookie("username", res.data.data.username, 7);
        HandleCookies.setCookie("refreshToken", res.data["refreshToken"], 30);
        setIsLoggedIn(true);
      }
    });
  }, []);
  return (
    <div>
      {isLoggedIn ? (
        <Navigate to={"/"} replace={true} />
      ) : (
        <h3>Something wrong, try to log in again:((</h3>
      )}
    </div>
  );
};

export default LoginGoogle;
