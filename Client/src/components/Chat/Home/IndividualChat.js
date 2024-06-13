import { useEffect, useState } from "react";
import styles from "./styles.module.css";
import { useNavigate, useSearchParams } from "react-router-dom";
import UserApi from "../../../getApi/UserApi";
import HandleCookies from "../../../utils/HandleCookies";
import { save, open } from "../../../getApi/ChatApi";
const IndividualChat = ({ username, setUsername, room, setRoom, socket }) => {
  const navigate = useNavigate();
  const [chat, setChat] = useState();
  const [searchParams, setSearchParams] = useSearchParams();
  const [name, setName] = useState("");
  useEffect(() => {
    UserApi.getUserInfo(HandleCookies.getCookie("accessToken"))
      .then((rs) => {
        if (rs?.data?.status === "success") {
          console.log(rs);
          setUsername({
            username: rs?.data?.data?.username,
            userId: rs?.data?.data._id,
          });
        } else {
          navigate("/error");
        }
      })
      .catch((err) => navigate("/error"));
    open({
      username: searchParams.get("username"),
      _id: searchParams.get("id"),
      accessToken: HandleCookies.getCookie("accessToken"),
    })
      .then((rs) => {
        setRoom(rs?.data?.data?._id);
        setName(rs?.data?.data?.name);
      })
      .catch((err) => navigate("/error"));
  }, [socket]);

  const joinRoom = () => {
    if (room !== "" && username.username && username.userId) {
      socket.emit("join_room", {
        username: username.username,
        room,
        userId: username.userId,
      });
    }
    navigate("/chat", { replace: true });
  };

  return (
    <div className={`${styles.container} mt-5 mr-5 rounded-md`}>
      <div className={`${styles.formContainer}`}>
        <h1>{`Chat`}</h1>
        <input
          className={styles.input}
          placeholder="Username..."
          disabled
          value={name}
        />

        <div className="flex justify-evenly">
          <button
            className="btn btn-secondary"
            style={{ width: "100%" }}
            onClick={joinRoom}
          >
            Join Room
          </button>
        </div>
      </div>
    </div>
  );
};

export default IndividualChat;
