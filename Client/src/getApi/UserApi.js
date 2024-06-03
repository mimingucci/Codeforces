import axios from "axios";
const BASE_URL = "http://localhost:1234/api/user";
class UserApi {
  getAllUsers() {
    return axios.get(BASE_URL + "/all");
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
  updateUser(username, firstname, lastname, description, newpassword) {
    return axios.put(BASE_URL + "/update?id=" + username, {
      firstname,
      lastname,
      description,
      password: newpassword,
    });
  }
  login(username, password) {
    return axios.post(BASE_URL + "/login", null, {
      headers: { "Content-Type": "application/json; charset=UTF-8" },
      params: { username: username, password: password },
    });
  }
  signup(email, username, password) {
    return axios.post(BASE_URL + "/create", { username, password, email });
  }
}
export default new UserApi();
