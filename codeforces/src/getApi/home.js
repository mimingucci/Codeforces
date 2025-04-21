import axios from "../axios";
export const getHome = async () => {
  try {
    const response = await axios({
      // baseURL: "localhost:8080/baomau",
      url: "/blog/getall",
      method: "get",
      headers: { "Content-Type": "application/json" },
    });
    return response;
  } catch (error) {
    return error;
  }
};
