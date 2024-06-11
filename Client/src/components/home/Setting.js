import { useLocation, useNavigate, useParams } from "react-router-dom";
import UserApi from "../../getApi/UserApi";
import HandleCookies from "../../utils/HandleCookies";
import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const Setting = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState();
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [description, setDescription] = useState("");
  const { username } = useParams();
  useEffect(() => {
    if (!username) {
      navigate("/error");
    } else {
      UserApi.allow({
        accessToken: HandleCookies.getCookie("accessToken"),
        username,
      })
        .then((rs) => {
          if (rs?.data?.status === "success") {
            setUser(rs?.data?.data);
            setFirstname(rs?.data?.data?.firstname);
            setLastname(rs?.data?.data?.lastname);
            setDescription(rs?.data?.data?.description);
          } else {
            navigate("/error");
          }
        })
        .catch((err) => navigate("/error"));
    }
  }, []);
  const handleSubmit = async (e) => {
    e.preventDefault();
    const rs = await UserApi.updateUser({
      accessToken: HandleCookies.getCookie("accessToken"),
      firstname,
      lastname,
      description,
    });
    if (!rs || rs?.data?.status !== "success") {
      showErrorToast("Something went wrong:((");
    } else {
      showSuccessToast("Updated info successfully");
    }
  };

  const showSuccessToast = (msg) => {
    toast.success(msg || `Compiled Successfully!`, {
      position: "top-right",
      autoClose: 1000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  };
  const showErrorToast = (msg, timer) => {
    toast.error(msg || `Something went wrong! Please try again.`, {
      position: "top-right",
      autoClose: timer ? timer : 1000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  };
  return (
    <div className="w-full">
      <ToastContainer
        position="top-center"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <div className="border-[2px] rounded-md border-solid mt-[15px] mr-5 border-gray-300 text-left p-3">
        <form>
          <h1>Change setting:</h1>
          <div class="field">
            <label for="name">First Name:</label>
            <input
              type="text"
              id="firstname"
              name="firstname"
              placeholder="Enter your firstname"
              value={user?.firstname}
              onChange={(e) => setFirstname(e.target.value)}
            />
            <small></small>
          </div>
          <div class="field">
            <label for="name">Last Name:</label>
            <input
              type="text"
              id="lastname"
              name="lastname"
              placeholder="Enter your lastname"
              value={user?.lastname}
              onChange={(e) => setLastname(e.target.value)}
            />
            <small></small>
          </div>
          <div class="field">
            <label for="name">Description:</label>
            <input
              type="text"
              id="description"
              name="description"
              placeholder="Enter your description"
              value={user?.description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <small></small>
          </div>
          <div class="field">
            <label for="name">Old Password:</label>
            <input
              type="password"
              id="oldpassword"
              name="oldpassword"
              placeholder="Enter your old password"
            />
            <small></small>
          </div>
          <div class="field">
            <label for="name">New Password:</label>
            <input
              type="password"
              id="newpassword"
              name="newpassword"
              placeholder="Enter your new password"
            />
            <small></small>
          </div>
          <div className="text-center">
            <button
              type="submit"
              onClick={handleSubmit}
              className="bg-blue-600 rounded-sm text-white px-[10px] py-[5px] mt-[20px] mx-auto"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
export default Setting;
