// interceptor.js
import { axios } from "../Features/utils";
import { store } from "./store"; // Import your Redux store
import { getNewAccessToken } from "../Features/User/userSlice";

export const interceptor = () => {
  console.log("Seen interceptor");
  axios.interceptors.response.use(
    (response) => {
      console.log("Seen interceptor");
      return response;
    },
    async (error) => {
      console.log("From interceptor: ", error);
      if (error.response && error.response.status === 403) {
        // Dispatch an action to refresh the access token
        store.dispatch(getNewAccessToken());
        // Get the new access token from the store
        const newAccessToken = store.getState().user.accessToken;

        // Replace the old access token with the new one and retry the original request
        error.config.headers.Authorization = `Bearer ${newAccessToken}`;
        return axios(error.config);
      }
      return Promise.reject(error);
    }
  );
};
