import { useEffect, useState } from "react";
import styles from "./styles.module.css";
import { useNavigate } from "react-router-dom";
import UserApi from "../../../getApi/UserApi";
import HandleCookies from "../../../utils/HandleCookies";
import { save } from "../../../getApi/ChatApi";
const Home = ({ username, setUsername, room, setRoom, socket }) => {
  const navigate = useNavigate();
  const [valid, setValid] = useState(true);
  const [created, setCreated] = useState(false);
  const [chats, setChats] = useState([]);
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
          setChats(rs?.data?.data?.chats);
        } else {
          navigate("/error");
        }
      })
      .catch((err) => navigate("/error"));
  }, [created]);

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

  const createRoom = async () => {
    if (!name) {
      setValid(false);
      return;
    }
    const rs = await save({
      name,
      accessToken: HandleCookies.getCookie("accessToken"),
      users: [username.userId],
    });
    if (rs?.data?.status === "success") {
      setCreated(true);
    }
  };

  return (
    <div className={`${styles.container} mt-5 mr-5 rounded-md`}>
      <div className={`${styles.formContainer}`}>
        <h1>{`Chat`}</h1>
        <input
          className={styles.input}
          placeholder="Username..."
          disabled
          value={username?.username}
        />

        <select
          className={styles.input}
          onChange={(e) => setRoom(e.target.value)}
        >
          <option>-- Select Room --</option>
          {chats &&
            chats.map((room) => <option value={room._id}>{room.name}</option>)}
        </select>
        <label for="inp" className={`text-red-600 ${valid ? "hidden" : ""}`}>
          Room name must not be empty
        </label>
        <label
          for="inp"
          className={`text-green-600 ${!created ? "hidden" : ""}`}
        >
          New room is created successfully
        </label>
        <input
          className={styles.input}
          placeholder="Create New Room"
          id="inp"
          onChange={(e) => setName(e.target.value)}
        />

        <div className="flex justify-evenly">
          <button
            className="btn btn-secondary"
            style={{ width: "100%" }}
            onClick={createRoom}
          >
            Create
          </button>
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

export default Home;
