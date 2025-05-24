import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import UserApi from "../../getApi/UserApi";
import HandleCookies from "../../utils/HandleCookies";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  // Check if user is already logged in
  useEffect(() => {
    const token = HandleCookies.getCookie("token");
    if (token) {
      // User is already logged in, redirect to home page
      navigate("/");
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (!email || !password) {
      setErrorMessage("Please enter email and password");
      return;
    }

    try {
      setIsLoading(true);
      const res = await UserApi.login({ email, password });

      if (!res?.data || res?.data?.code !== "200") {
        setErrorMessage(res?.data?.message || "Something went wrong");
        return;
      }

      HandleCookies.setCookie("token", res.data.data.token, 7);
      HandleCookies.setCookie("username", res.data.data.username, 7);
      HandleCookies.setCookie("email", res.data.data.email, 7);
      HandleCookies.setCookie("id", res.data.data.id, 7);

      navigate("/");
    } catch (err) {
      setErrorMessage("Login information is incorrect");
    } finally {
      setIsLoading(false);
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

            {errorMessage && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded">
                {errorMessage}
              </div>
            )}

            <form className="mt-6" onSubmit={handleSubmit}>
              <div className="mb-2">
                <label
                  htmlFor="email"
                  className="block text-sm font-semibold text-gray-800 text-left"
                >
                  Email
                </label>
                <input
                  onChange={(e) => handleChangeEmail(e.target.value)}
                  type="email"
                  id="email"
                  className="block w-full px-4 py-2 mt-2 text-blue-700 bg-white border rounded-md focus:border-blue-400 focus:ring-blue-300 focus:outline-none focus:ring focus:ring-opacity-40"
                  required
                />
              </div>
              <div className="mb-2">
                <label
                  htmlFor="password"
                  className="block text-sm font-semibold text-gray-800 text-left"
                >
                  Password
                </label>
                <input
                  onChange={(e) => {
                    handleChangePassword(e.target.value);
                  }}
                  type="password"
                  id="password"
                  className="block w-full px-4 py-2 mt-2 text-blue-700 bg-white border rounded-md focus:border-blue-400 focus:ring-blue-300 focus:outline-none focus:ring focus:ring-opacity-40"
                  required
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
                  type="submit"
                  className="w-full px-4 py-2 tracking-wide text-white transition-colors duration-200 transform bg-blue-400 rounded-md hover:bg-blue-500 focus:outline-none focus:bg-blue-600 disabled:opacity-70"
                  disabled={isLoading}
                >
                  {isLoading ? "Logging in..." : "Login"}
                </button>
              </div>
            </form>

            <p className="mt-8 text-xs font-light text-center text-gray-700">
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
