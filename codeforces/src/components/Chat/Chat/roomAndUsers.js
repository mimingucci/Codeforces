import styles from "./styles.module.css";
import { useState, useEffect, Suspense, useDeferredValue } from "react";
import { useNavigate } from "react-router-dom";
import icons from "../../../utils/icons";
import SearchUser from "./SearchUser";
import { addUserToChat } from "../../../getApi/ChatApi";
import HandleCookies from "../../../utils/HandleCookies";
const { IoIosNotifications, IoMdSearch } = icons;
const RoomAndUsers = ({ socket, username, room }) => {
  const [roomUsers, setRoomUsers] = useState([]);

  const [value, setValue] = useState("");
  const deferredQuery = useDeferredValue(value);
  const navigate = useNavigate();

  const addUserToRoom = async (user) => {
    const rs = await addUserToChat({
      user: user,
      chat: room,
      accessToken: HandleCookies.getCookie("accessToken"),
    });
    if (rs?.data?.status === "success") {
      setRoomUsers(rs?.data?.data?.members);
      setValue("");
    } else {
      alert("Something went wrong when adding user to room");
    }
  };

  useEffect(() => {
    socket.on("chatroom_users", (data) => {
      console.log(data);
      setRoomUsers(data);
    });

    return () => socket.off("chatroom_users");
  }, [socket]);

  const leaveRoom = () => {
    const __createdtime__ = Date.now();
    socket.emit("leave_room", {
      username: username.username,
      room,
      __createdtime__,
    });
    navigate("/usertalk", { replace: true });
  };

  return (
    <div className={`${styles.roomAndUsersColumn}`}>
      <div>
        {roomUsers.length > 0 && (
          <h5 className={`${styles.usersTitle} font-bold`}>Users:</h5>
        )}
        <ul className={styles.usersList}>
          {roomUsers.map((user) => (
            <li
              style={{
                fontWeight: `${
                  user.username === username.username ? "bold" : "normal"
                }`,
              }}
              key={user.id}
            >
              {user.username}
            </li>
          ))}
        </ul>
      </div>

      <div className="relative">
        <div className="text-left">Add User</div>
        <div className="py-1 flex px-3">
          <input
            type={"text"}
            placeholder="Search"
            className="flex-1 bg-gray-200 outline-none w-auto h-fit"
            onChange={(e) => setValue(e.target.value)}
            value={value}
          />
        </div>
        <div
          className={`absolute bg-white w-full border-solid border-gray-500 border-[1px] rounded-md ${
            !deferredQuery ? "hidden" : ""
          }`}
        >
          <Suspense fallback={<h2>Loading...</h2>}>
            <SearchUser query={value} setValue={addUserToRoom} />
          </Suspense>
        </div>
      </div>

      <button
        className="btn btn-outline bg-red-600 text-white p-2 m-5 hover:bg-red-800 rounded-md"
        onClick={leaveRoom}
      >
        Leave
      </button>
    </div>
  );
};

export default RoomAndUsers;
