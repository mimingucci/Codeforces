import axios from "axios";
const BASE_URL = "http://localhost:8080/api/v1/blog";
const COMMENT_URL = "http://localhost:8080/api/v1/comment";
class BlogApi {
  getAllBlogs() {
    return axios.get(BASE_URL + "/all");
  }
  getBlogById(id) {
    return axios.get(BASE_URL + id);
  }
  getBlogByUsername(author) {
    return axios.get(BASE_URL + "/get/username?author=" + author);
  }
  recentlyActive({ page = 1 }) {
    return axios.get(BASE_URL + `/fetch?page=${page}&sort=-updatedAt`);
  }
  updateById({ id, blog, accessToken }) {
    return axios.put(BASE_URL + "/update/" + id, blog, {
      headers: { Authorization: "Bearer " + accessToken },
    });
  }
  createBlog({ blog, accessToken }) {
    return axios.post(BASE_URL + "/create", blog, {
      headers: { Authorization: "Bearer " + accessToken },
    });
  }
  updateLike({ blog, accessToken }) {
    return axios.put(
      BASE_URL + "/update/like",
      { blog },
      { headers: { Authorization: "Bearer " + accessToken } }
    );
  }
  updateDislike({ blog, accessToken }) {
    return axios.put(
      BASE_URL + "/update/dislike",
      { blog },
      { headers: { Authorization: "Bearer " + accessToken } }
    );
  }
  delete({ accessToken, id }) {
    return axios.delete(BASE_URL + "/delete/" + id, {
      headers: { Authorization: "Bearer " + accessToken },
    });
  }
  createComment(content, author, blogId) {
    return axios.post(COMMENT_URL + "/create", { content, author, blogId });
  }
}
export default new BlogApi();
