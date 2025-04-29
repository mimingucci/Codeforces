import axios from "axios";
const JSONbig = require('json-bigint')({ storeAsString: true });

const BASE_URL = "http://localhost:8080/api/v1/problem";

class ProblemApi {
  create({
    statement,
    title,
    timelimit,
    memorylimit,
    accessToken,
    tags = [],
    solution,
  }) {
    return axios.post(
      BASE_URL + "/create",
      { title, statement, timelimit, memorylimit, tags, solution },
      { headers: { Authorization: "Bearer " + accessToken } }
    );
  }
  addTestCase({ problem, input, output, accessToken }) {
    return axios.post(
      BASE_URL + "/testcase?id=" + problem,
      { input, output },
      { headers: { Authorization: "Bearer " + accessToken } }
    );
  }
  getProblem(id) {
    return axios.get(BASE_URL + '/' + id, {
      transformResponse: (data) => {
        const res = JSONbig.parse(data);
        return res;
      },
    });
  }
  getProblemsByContestId(id) {
    return axios.get(BASE_URL + '/contest/' + id, {
      transformResponse: (data) => {
        const res = JSONbig.parse(data);
        return res;
      },
    });
  }
  getProblems({ page }) {
    return axios.get(BASE_URL + "/all?page=" + page, {
      transformResponse: (data) => {
        return JSONbig.parse(data);
      },
    });
  }
  update({
    statement,
    id,
    title,
    timelimit,
    memorylimit,
    accessToken,
    solution,
    tags,
  }) {
    return axios.put(
      BASE_URL + "/update?id=" + id,
      { title, statement, timelimit, memorylimit, solution, tags },
      { headers: { Authorization: "Bearer " + accessToken } }
    );
  }
}

export default new ProblemApi();
