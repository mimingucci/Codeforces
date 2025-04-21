import axios from "axios";

const BASE_URL = "http://localhost:8080/api/chat";

export const save = async ({ name, accessToken, users }) => {
  return await axios.post(
    BASE_URL + "/create",
    { name, users },
    { headers: { Authorization: "Bearer " + accessToken } }
  );
};

export const addUserToChat = async ({ user, chat, accessToken }) => {
  return await axios.post(
    BASE_URL + "/add",
    { user, chat },
    { headers: { Authorization: "Bearer " + accessToken } }
  );
};

export const open = async ({ username, _id, accessToken }) => {
  return await axios.post(
    BASE_URL + "/open",
    { username, _id },
    { headers: { Authorization: "Bearer " + accessToken } }
  );
};
