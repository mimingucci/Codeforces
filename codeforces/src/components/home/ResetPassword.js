import { useEffect, useState } from "react";
import UserApi from "../../getApi/UserApi";
import { useNavigate, useParams } from "react-router-dom";
const ResetPassword = () => {
  const [email, setEmail] = useState();
  const [token, setToken] = useState();
  const [password, setPassword] = useState("");
  const params = useParams();
  const naviagte = useNavigate();
  useEffect(() => {
    if (!params?.email || !params?.token) {
      naviagte("/error", { replace: true });
    }
    setEmail(params?.email);
    setToken(params?.token);
  }, []);
  const handleSubmit = async () => {
    try {
      const rs = await UserApi.resetPassword({ email, token, password });

      if (rs?.data?.status === "success") {
        alert(rs?.data?.data);
        naviagte("/login");
      } else {
        alert(rs?.data?.data);
      }
    } catch (error) {
      alert("Something went wrong");
    }
  };

  return (
    <div className="mt-5">
      <div>
        <div className="relative flex flex-col justify-center min-h-screen overflow-hidden">
          <div className="w-full p-6 m-auto bg-white rounded-md shadow-xl lg:max-w-xl">
            <h1 className="text-3xl font-semibold text-center text-blue-500 uppercase">
              Reset Password
            </h1>
            <form className="mt-6">
              <div className="mb-2">
                <label
                  for="password"
                  className="block text-sm font-semibold text-gray-800 text-left"
                >
                  Password
                </label>
                <input
                  onChange={(e) => setPassword(e.target.value)}
                  type="text"
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
                  Reset
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ResetPassword;
