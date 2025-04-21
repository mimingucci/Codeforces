import axios from "axios";
const BASE_URL = "http://localhost:1234/api/testcase";

class TestCaseApi {
  update({ input, id, output, accessToken }) {
    return axios.put(
      BASE_URL + "/update?id=" + id,
      { input, output },
      { headers: { Authorization: "Bearer " + accessToken } }
    );
  }
}

export default new TestCaseApi();
