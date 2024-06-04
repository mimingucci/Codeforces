import { useState } from "react";
import UserApi from "../../getApi/UserApi";
const SignUp = () => {
  const [nickname, setNickname] = useState("");
  const [password, setPassword] = useState("");
  const [confirmpassword, setConfirmpassword] = useState("");
  const [email, setEmail] = useState("");

  const validateEmail = (email) => {
    return email.match(
      /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
  };

  const handleSubmit = async () => {
    if (confirmpassword != password) {
      alert("Please enter true password");
      return;
    }
    if (!validateEmail(email)) {
      alert("Please enter a valid email");
      return;
    }
    try {
      const res = await UserApi.signup(email, nickname, password);
      window.location.replace("/login");
    } catch (err) {
      alert("Something wennt wrong");
    }
  };
  const handleChangeUsername = (e) => {
    setNickname(e);
  };
  const handleChangeEmail = (e) => {
    setEmail(e);
  };
  const handleChangePassword = (e) => {
    setPassword(e);
  };
  const handleChangeConfirmpassword = (e) => {
    setConfirmpassword(e);
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
              Sign Up
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
                  type="email"
                  className="block w-full px-4 py-2 mt-2 text-blue-700 bg-white border rounded-md focus:border-blue-400 focus:ring-blue-300 focus:outline-none focus:ring focus:ring-opacity-40"
                />
              </div>
              <div className="mb-2">
                <label
                  for="nickname"
                  className="block text-sm font-semibold text-gray-800 text-left"
                >
                  Username
                </label>
                <input
                  onChange={(e) => {
                    handleChangeUsername(e.target.value);
                  }}
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
                  onChange={(e) => handleChangePassword(e.target.value)}
                  type="password"
                  className="block w-full px-4 py-2 mt-2 text-blue-700 bg-white border rounded-md focus:border-blue-400 focus:ring-blue-300 focus:outline-none focus:ring focus:ring-opacity-40"
                />
              </div>
              <div className="mb-2">
                <label
                  for="confirmpassword"
                  className="block text-sm font-semibold text-gray-800 text-left"
                >
                  Confirm Password
                </label>
                <input
                  onChange={(e) => handleChangeConfirmpassword(e.target.value)}
                  type="password"
                  className="block w-full px-4 py-2 mt-2 text-blue-700 bg-white border rounded-md focus:border-blue-400 focus:ring-blue-300 focus:outline-none focus:ring focus:ring-opacity-40"
                />
              </div>
              <div className="mt-6">
                <button
                  className="w-full px-4 py-2 tracking-wide text-white transition-colors duration-200 transform bg-blue-400 rounded-md hover:bg-blue-500 focus:outline-none focus:bg-blue-600"
                  onClick={(e) => {
                    e.preventDefault();
                    handleSubmit();
                  }}
                >
                  Sign Up
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
export default SignUp;
