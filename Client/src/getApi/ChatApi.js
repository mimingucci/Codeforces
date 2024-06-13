import axios from "axios";

const BASE_URL = "http://localhost:1234/api/chat";

export const save = async ({ name, accessToken, users }) => {
  return await axios.post(
    BASE_URL + "/create",
    { name, users },
    { headers: { Authorization: "Bearer " + accessToken } }
  );
};
