import axios from "axios";
const BASE_URL = "http://localhost:1234/api/user";
class UserApi {
  getAllUsers() {
    return axios.get(BASE_URL + "/all");
  }
  getTopUsers({ field = "-rating" }) {
    return axios.get(BASE_URL + `/fetch?sort=${field}&page=1&enabled=true`);
  }
  getUserById(id) {
    return axios.get(BASE_URL + "/id/" + id);
  }
  getUserByEmail(email) {
    return axios.get(BASE_URL + "/email?email=" + email);
  }
  getUserByUsername(username) {
    return axios.get(BASE_URL + "/username/" + username);
  }
  getListUserByRating(page) {
    return axios.get(BASE_URL + "/rating/" + page);
  }
  getTopContributors() {
    return axios.get(BASE_URL + "/topcontributors");
  }
  getResultBySearch(keyword) {
    return axios.get(BASE_URL + "/search", { params: { query: keyword } });
  }
  updateUser({ accessToken, firstname, lastname, description }) {
    return axios.put(
      BASE_URL + "/update",
      {
        firstname,
        lastname,
        description,
      },
      { headers: { Authorization: "Bearer " + accessToken } }
    );
  }
  login({ email, password }) {
    return axios.post(BASE_URL + "/login", {
      email,
      password,
    });
  }
  logout(accessToken) {
    return axios.get(BASE_URL + "/logout", {
      headers: { Authorization: "Bearer " + accessToken },
    });
  }
  uploadImage({ file, accessToken }) {
    const formData = new FormData();
    formData.append("avatar", file);
    return axios.put(BASE_URL + "/avatar", formData, {
      headers: {
        Authorization: "Bearer " + accessToken,
      },
    });
  }
  unsetImage(accessToken) {
    return axios.delete(BASE_URL + "/unset-avatar", {
      headers: {
        Authorization: "Bearer " + accessToken,
      },
    });
  }
  getUserInfo(accessToken) {
    return axios.get(BASE_URL + "/info", {
      headers: { Authorization: "Bearer " + accessToken },
    });
  }
  allow({ accessToken, username, id }) {
    return axios.post(
      BASE_URL + "/allow",
      { username, id },
      {
        headers: { Authorization: "Bearer " + accessToken },
      }
    );
  }
  refreshAccessToken(refreshToken) {
    return axios.get(BASE_URL + "/reset-access-token", {
      headers: { Authorization: "Bearer " + refreshToken },
    });
  }
  signup(email, username, password) {
    return axios.post(BASE_URL + "/create", { username, password, email });
  }
}
export default new UserApi();
