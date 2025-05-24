import axios from "axios";
const JSONbig = require("json-bigint")({ storeAsString: true });

const BASE_URL = "http://localhost:8080/api/v1/contest";

class ContestApi {
  getContestById(id) {
    return axios.get(BASE_URL + "/" + id, {
      transformResponse: (data) => {
        const res = JSONbig.parse(data);
        return res;
      },
    });
  }
  getUpcomingContests({ days = 7, type = "SYSTEM" }) {
    return axios.get(BASE_URL + `/coming?next=${days}&type=${type}`, {
      transformResponse: (data) => {
        return JSONbig.parse(data);
      },
    });
  }
  getPastContests({ page = 0, type = "SYSTEM", size = 20 }) {
    return axios.get(
      BASE_URL + `/past?page=${page}&type=${type}&size=${size}`,
      {
        transformResponse: (data) => {
          return JSONbig.parse(data);
        },
      }
    );
  }
  getRunningContests({ type = "SYSTEM" }) {
    return axios.get(BASE_URL + `/running?type=${type}`, {
      transformResponse: (data) => {
        return JSONbig.parse(data);
      },
    });
  }
  registerContest({ contestId, accessToken, isRated }) {
    return axios.post(
      BASE_URL + `/${contestId}/registration`,
      {
        rated: isRated,
        contest: contestId,
      },
      { headers: { Authorization: "Bearer " + accessToken } }
    );
  }
  cancelRegistration({ contestId, accessToken }) {
    return axios.delete(BASE_URL + `/${contestId}/registration`, {
      headers: { Authorization: "Bearer " + accessToken },
    });
  }
  updateRegistration({ contestId, accessToken, isRated }) {
    return axios.put(
      BASE_URL + `/${contestId}/registration`,
      {
        rated: isRated,
        contest: contestId,
      },
      { headers: { Authorization: "Bearer " + accessToken } }
    );
  }
  getUserRegistration({ contestId, accessToken }) {
    return axios.get(BASE_URL + `/${contestId}/registration`, {
      headers: { Authorization: "Bearer " + accessToken },
    });
  }
  canSubmit({ contestId, userId }) {
    return axios.get(BASE_URL + `/${contestId}/check?userId=${userId}`);
  }
  lockSubmissionApi(userId) {
    return axios.get(BASE_URL + `/user/${userId}`);
  }
  createVirtualContest({accessToken, contest, startTime}) {
    return axios.post(BASE_URL + "/virtual", {
      contest,
      startTime,
    },
    { 
      headers: { Authorization: "Bearer " + accessToken },
      transformResponse: (data) => {
        const res = JSONbig.parse(data);
        return res;
      },
    }
  );
  }
  getVirtualContestIfExists(id) {
    return axios.get(BASE_URL + `/virtual/user/${id}`, {
        transformResponse: (data) => {
          const res = JSONbig.parse(data);
          return res;
        },
      }
    )
  }
}

export default new ContestApi();
