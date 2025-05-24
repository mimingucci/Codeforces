import axios from "axios";
const JSONbig = require("json-bigint")({ storeAsString: true });
const BASE_URL = "http://localhost:8080/api/v1/user";
const AUTH_URL = "http://localhost:8080/api/v1/auth";

class UserApi {
  getAllUsers() {
    return axios.get(BASE_URL + "/all", {
      transformResponse: (data) => {
        const res = JSONbig.parse(data);
        return res;
      },
    });
  }
  getTopRatings({ limit = 100 }) {
    return axios.get(
      BASE_URL + `/all?ratingDir=DESC&page=0&pageSize=${limit}`,
      {
        transformResponse: (data) => {
          const res = JSONbig.parse(data);
          return res;
        },
      }
    );
  }
  getTopContributors({ limit = 100 }) {
    return axios.get(
      BASE_URL + `/all?contributionDir=DESC&page=0&pageSize=${limit}`,
      {
        transformResponse: (data) => {
          const res = JSONbig.parse(data);
          return res;
        },
      }
    );
  }
  search({ page = 0, query, limit = 100 }) {
    return axios.get(
      BASE_URL + `/search?page=${page}&query=${query}&pageSize=${limit}`,
      {
        transformResponse: (data) => {
          const res = JSONbig.parse(data);
          return res;
        },
      }
    );
  }
  getUserById(id) {
    return axios.get(BASE_URL + "/" + id, {
      transformResponse: (data) => {
        return JSONbig.parse(data);
      },
    });
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
  getResultBySearch(keyword) {
    return axios.get(BASE_URL + "/search", { params: { query: keyword } });
  }
  changePassword({ accessToken, email, password }) {
    return axios.post(
      AUTH_URL + "/change-password",
      { email, password },
      {
        headers: { Authorization: "Bearer " + accessToken },
      }
    );
  }
  updateUser({
    accessToken,
    id,
    firstname = null,
    lastname = null,
    description = null,
    country,
  }) {
    let body = { id };
    if (firstname) body.firstname = firstname;
    if (lastname) body.lastname = lastname;
    if (description) body.description = description;
    if (country) body.country = country;
    return axios.put(BASE_URL + "/profile/update", body, {
      headers: { Authorization: "Bearer " + accessToken },
      transformResponse: (data) => {
        const res = JSONbig.parse(data);
        return res;
      },
    });
  }
  setOnline(accessToken) {
    return axios.put(
      BASE_URL + "/status/online",
      {},
      {
        headers: { Authorization: "Bearer " + accessToken },
      }
    );
  }
  setOffline(accessToken) {
    return axios.put(
      BASE_URL + "/status/offline",
      {},
      {
        headers: { Authorization: "Bearer " + accessToken },
      }
    );
  }
  login({ email, password }) {
    return axios.post(
      AUTH_URL + "/login",
      {
        email,
        password,
      },
      {
        transformResponse: (data) => {
          const res = JSONbig.parse(data);
          return res;
        },
      }
    );
  }
  logout(accessToken) {
    return axios.get(AUTH_URL + "/logout", {
      headers: { Authorization: "Bearer " + accessToken },
    });
  }
  uploadImage({ file, accessToken }) {
    const formData = new FormData();
    formData.append("avatar", file);
    return axios.post(BASE_URL + "/avatar", formData, {
      headers: {
        Authorization: "Bearer " + accessToken,
      },
    });
  }
  unsetImage(accessToken) {
    return axios.delete(BASE_URL + "/avatar", {
      headers: {
        Authorization: "Bearer " + accessToken,
      },
    });
  }
  getUserInfo(accessToken) {
    return axios.get(
      BASE_URL + "/info",
      {
        headers: { Authorization: "Bearer " + accessToken },
      },
      {
        transformResponse: (data) => {
          const res = JSONbig.parse(data);
          return res;
        },
      }
    );
  }
  verifyEmail(accessToken) {
    return axios.post(
      AUTH_URL + "/verify",
      { token: accessToken },
      {
        headers: { Authorization: "Bearer " + accessToken },
      }
    );
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
    return axios.post(AUTH_URL + "/registration", {
      username,
      password,
      email,
    });
  }
  forgotPassword(email) {
    return axios.post(AUTH_URL + "/forgot-password", { email });
  }
  resetPassword({ email, token, password }) {
    return axios.post(AUTH_URL + "/reset-password", { email, token, password });
  }
}
export default new UserApi();
