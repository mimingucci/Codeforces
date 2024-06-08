import axios from "axios";
const BASE_URL = "http://localhost:1234/api/blog";
const COMMENT_URL = "http://localhost:1234/api/comment";
class BlogApi {
  getAllBlogs() {
    return axios.get(BASE_URL + "/getall");
  }
  getBlogById(id) {
    return axios.get(BASE_URL + "/get/" + id);
  }
  createBlog({ title, content, accessToken }) {
    return axios.post(
      BASE_URL + "/create",
      { title, content },
      { headers: { Authorization: "Bearer " + accessToken } }
    );
  }
  createComment(content, author, blogId) {
    return axios.post(
      COMMENT_URL + "/create",
      { content, author, blogId }
      //   { params: { postid, nickname } }
    );
  }
  updateLike(id, username) {
    return axios.put(BASE_URL + "/update/agree/" + id, null, {
      params: { username },
    });
  }
  updateDislike(id, username) {
    return axios.put(BASE_URL + "/update/disagree/" + id, null, {
      params: { username },
    });
  }
}
export default new BlogApi();
