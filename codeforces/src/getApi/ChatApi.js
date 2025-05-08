import axios from "axios";
const JSONbig = require("json-bigint")({ storeAsString: true });
const BASE_URL = "http://localhost:8080/api/v1/chat";

class ChatApi {
  getRooms(accessToken) {
    return axios.get(BASE_URL + "/room/user", {
      headers: { Authorization: "Bearer " + accessToken },
      transformResponse: (data) => {
        return JSONbig.parse(data);
      },
    });
  }
  getMessages({ roomId, page = 0, size = 50, accessToken }) {
    return axios.get(`${BASE_URL}/room/${roomId}/message`, {
      params: {
        page,
        size,
      },
      headers: { Authorization: `Bearer ${accessToken}` },
      transformResponse: (data) => {
        return JSONbig.parse(data);
      },
    });
  }
  createRoom({ room, accessToken }) {
    return axios.post(BASE_URL + "/room", room, {
      headers: { Authorization: "Bearer " + accessToken },
      transformResponse: (data) => {
        return JSONbig.parse(data);
      },
    });
  }
}
export default new ChatApi();
