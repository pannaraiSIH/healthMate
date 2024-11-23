const axios = require("axios");

const axiosInstance = axios.create({
  timeout: 1000 * (10 * 60),
});

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      return {
        ...error.response,
        status: error.response.status,
      };
    }

    return Promise.reject(error);
  }
);

module.exports = axiosInstance;
