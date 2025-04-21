import axios from "axios";
const BASE_URL = "http://localhost:1234/api/comment";
class CommentApi {
  updateLike({ comment, accessToken }) {
    return axios.put(
      BASE_URL + "/update/like",
      {
        comment,
      },
      {
        headers: { Authorization: "Bearer " + accessToken },
      }
    );
  }
  updateDislike({ comment, accessToken }) {
    return axios.put(
      BASE_URL + "/update/dislike",
      { comment },
      {
        headers: { Authorization: "Bearer " + accessToken },
      }
    );
  }
  getCommentById(id) {
    return axios.get(BASE_URL + "/get/" + id);
  }
  createComment({ content, accessToken, blogId }) {
    return axios.post(
      BASE_URL + "/create",
      { content, blogId },
      { headers: { Authorization: "Bearer " + accessToken } }
    );
  }
}
export default new CommentApi();
