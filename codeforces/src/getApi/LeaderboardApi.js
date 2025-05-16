import axios from "axios";
const JSONbig = require("json-bigint")({ storeAsString: true });

const BASE_URL = "http://localhost:8080/api/v1/ranking";

class LeaderboardApi {
  getLeaderboard(id) {
    return axios.get(BASE_URL + "/" + id, {
      transformResponse: (data) => {
        const res = JSONbig.parse(data);
        return res;
      },
    });
  }
  getHistoryCompetition(userId) {
    return axios.get(BASE_URL + "/changes/" + userId, {
      transformResponse: (data) => {
        const res = JSONbig.parse(data);
        return res;
      },
    });
  }
}

export default new LeaderboardApi();
