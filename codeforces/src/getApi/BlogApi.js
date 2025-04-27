import axios from "axios";
const JSONbig = require('json-bigint')({ storeAsString: true });

const BASE_URL = "http://localhost:8080/api/v1/blog";
const COMMENT_URL = "http://localhost:8080/api/v1/comment";

class BlogApi {
  getAllBlogs() {
    return axios.get(BASE_URL + "/all", {
      transformResponse: (data) => {
        return JSONbig.parse(data);
      },
    });
  }
  getBlogById(id) {
    return axios.get(BASE_URL + "/" + id, {
      transformResponse: (data) => {
        return JSONbig.parse(data);
      },
    });
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
    return axios.post(BASE_URL, blog, {
      headers: { Authorization: "Bearer " + accessToken },
    }, {
      transformResponse: (data) => {
        return JSONbig.parse(data);
      },
    });
  }
  updateLike({ blog, accessToken }) {
    return axios.put(
      BASE_URL + `/${blog}/like`,
      { blog },
      { headers: { Authorization: "Bearer " + accessToken }}, 
      { transformResponse: (data) => {
          return JSONbig.parse(data);
        },
      }
    );
  }
  updateDislike({ blog, accessToken }) {
    return axios.put(
      BASE_URL + `/${blog}/dislike`,
      { blog },
      { headers: { Authorization: "Bearer " + accessToken } },
      { transformResponse: (data) => {
          return JSONbig.parse(data);
        },
      }
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
