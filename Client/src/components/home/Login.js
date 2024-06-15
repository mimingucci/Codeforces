import { useState } from "react";
import UserApi from "../../getApi/UserApi";
import HandleCookies from "../../utils/HandleCookies";
const Login = () => {
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const handleSubmit = async () => {
    try {
      const res = await UserApi.login({ email, password });
      if (!res?.data || res?.data?.status !== "success") {
        alert("Something went wrong");
        return;
      }
      HandleCookies.setCookie("accessToken", res.data["accessToken"], 7);
      HandleCookies.setCookie("username", res.data.data.username, 7);
      HandleCookies.setCookie("refreshToken", res.data["refreshToken"], 30);
      window.location.replace("/");
    } catch (err) {
      console.log(err);
      alert("Login Info Not Exists");
    }
  };
  const handleChangePassword = (ps) => {
    // console.log(ps);
    setPassword(ps);
  };
  const handleChangeEmail = (ps) => {
    // console.log(ps);
    setEmail(ps);
  };
  return (
    <div className="mt-5">
      <div className="text-left">
        <p className="font-bold">Fill in the form to login into Codeforces.</p>
        <p>You can use Gmail as an alternative way to enter.</p>
      </div>
      <div>
        <div className="relative flex flex-col justify-center min-h-screen overflow-hidden">
          <div className="w-full p-6 m-auto bg-white rounded-md shadow-xl lg:max-w-xl">
            <h1 className="text-3xl font-semibold text-center text-blue-500 uppercase">
              Sign in
            </h1>
            <form className="mt-6">
              <div className="mb-2">
                <label
                  for="email"
                  className="block text-sm font-semibold text-gray-800 text-left"
                >
                  Email
                </label>
                <input
                  onChange={(e) => handleChangeEmail(e.target.value)}
                  type="text"
                  className="block w-full px-4 py-2 mt-2 text-blue-700 bg-white border rounded-md focus:border-blue-400 focus:ring-blue-300 focus:outline-none focus:ring focus:ring-opacity-40"
                />
              </div>
              <div className="mb-2">
                <label
                  for="password"
                  className="block text-sm font-semibold text-gray-800 text-left"
                >
                  Password
                </label>
                <input
                  onChange={(e) => {
                    handleChangePassword(e.target.value);
                  }}
                  type="password"
                  className="block w-full px-4 py-2 mt-2 text-blue-700 bg-white border rounded-md focus:border-blue-400 focus:ring-blue-300 focus:outline-none focus:ring focus:ring-opacity-40"
                />
              </div>
              <a
                href="/forgot-password"
                className="text-xs text-blue-600 hover:underline"
              >
                Forget Password?
              </a>
              <div className="mt-6">
                <button
                  className="w-full px-4 py-2 tracking-wide text-white transition-colors duration-200 transform bg-blue-400 rounded-md hover:bg-blue-500 focus:outline-none focus:bg-blue-600"
                  onClick={(e) => {
                    e.preventDefault();
                    handleSubmit();
                  }}
                >
                  Login
                </button>
              </div>
            </form>
            <div className="relative flex items-center justify-center w-full mt-6 border border-t">
              <div className="absolute px-5 bg-white">Or</div>
            </div>
            <div className="flex mt-4 gap-x-2">
              <button
                type="button"
                className="flex items-center justify-center w-full p-2 border border-gray-600 rounded-md focus:ring-2 focus:ring-offset-1 focus:ring-blue-400"
                onClick={() =>
                  window.open("http://localhost:1234/api/auth/google", "_self")
                }
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 32 32"
                  className="w-5 h-5 fill-current"
                >
                  <path d="M16.318 13.714v5.484h9.078c-0.37 2.354-2.745 6.901-9.078 6.901-5.458 0-9.917-4.521-9.917-10.099s4.458-10.099 9.917-10.099c3.109 0 5.193 1.318 6.38 2.464l4.339-4.182c-2.786-2.599-6.396-4.182-10.719-4.182-8.844 0-16 7.151-16 16s7.156 16 16 16c9.234 0 15.365-6.49 15.365-15.635 0-1.052-0.115-1.854-0.255-2.651z"></path>
                </svg>
              </button>
            </div>

            <p className="mt-8 text-xs font-light text-center text-gray-700">
              {" "}
              Don't have an account?{" "}
              <a
                href="/signup"
                className="font-medium text-blue-500 hover:underline"
              >
                Sign up
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Login;
