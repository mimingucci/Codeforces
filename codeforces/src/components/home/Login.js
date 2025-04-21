import { useState } from "react";
import UserApi from "../../getApi/UserApi";
import HandleCookies from "../../utils/HandleCookies";
const Login = () => {
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const handleSubmit = async () => {
    try {
      const res = await UserApi.login({ email, password });
      if (!res?.data || res?.data?.code !== "200") {
        alert("Something went wrong");
        return;
      }
      HandleCookies.setCookie("token", res.data.data.token, 7);
      HandleCookies.setCookie("username", res.data.data.username, 7);
      HandleCookies.setCookie("email", res.data.data.email, 7);
      HandleCookies.setCookie("id", res.data.data.id, 7);
      window.location.replace("/");
    } catch (err) {
      alert("Login Info Not Exists");
    }
  };
  const handleChangePassword = (ps) => {
    setPassword(ps);
  };
  const handleChangeEmail = (ps) => {
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
