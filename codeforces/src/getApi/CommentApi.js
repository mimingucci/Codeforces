import axios from "axios";
const JSONbig = require('json-bigint')({ storeAsString: true });
const BASE_URL = "http://localhost:8080/api/v1/comment";

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
    return axios.get(BASE_URL + "/" + id.toString(), {
    transformResponse: (data) => {
      return JSONbig.parse(data);
    },
  });
  }
  getCommentByBlogId(id) {
    return axios.get(BASE_URL + "/blog/" + id.toString(), {
      transformResponse: (data) => {
        return JSONbig.parse(data);
      },
    });
  }
  createComment({ content, accessToken, blogId }) {
    return axios.post(
      BASE_URL,
      { content, blog: blogId },
      { headers: { Authorization: "Bearer " + accessToken } }, 
      {
        transformResponse: (data) => {
          return JSONbig.parse(data);
        },
      }
    );
  }
}
export default new CommentApi();
