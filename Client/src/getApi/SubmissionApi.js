import axios from "axios";
const BASE_URL = "http://localhost:1234/api/submission";

class SubmissionApi {
  submit({ language, code, problem, token, accessToken }) {
    return axios.post(
      BASE_URL + "/submit",
      { language, code, problem, token },
      { headers: { Authorization: "Bearer " + accessToken } }
    );
  }
  update({
    status,
    time,
    memory,
    token,
    accessToken,
    stdin = "",
    stdout = "",
    stderr = "",
  }) {
    return axios.put(
      BASE_URL + "/update",
      { status, time, memory, token, stdin, stdout, stderr },
      { headers: { Authorization: "Bearer " + accessToken } }
    );
  }
}

export default new SubmissionApi();
