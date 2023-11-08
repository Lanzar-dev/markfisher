import Axios from "axios";
import { store } from "../Store/store";
import { getNewAccessToken } from "./User/userSlice";

const baseURL = "http://127.0.0.1:3100/";

export const axios = Axios.create({ baseURL });

export const aXios = (refreshtoken: string) =>
  Axios.create({
    baseURL: baseURL,
    timeout: 15000,
    headers: {
      Authorization: `Bearer ${refreshtoken}`,
    },
  });

const axiosWithAuth = Axios.create();

axiosWithAuth.interceptors.request.use((config) => {
  const token = store.getState().user.token as string;
  config.baseURL = baseURL;
  config.timeout = 15000;
  config.headers.Authorization = `Bearer ${token}`;

  return config;
});

axiosWithAuth.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    if (error?.response && error.response.status === 403) {
      console.log("Token has expired: ", error?.response?.status);
      await store.dispatch(getNewAccessToken());

      // After getting a new token, retry the original request
      const config = error.config;
      const newToken = store.getState().user.token as string;
      config.timeout = 15000;
      config.headers.Authorization = `Bearer ${newToken}`;
      console.log("config: ", config);

      return Axios(config);
    }
    // If it's not a 403 error, you can handle it as needed or re-throw the error
    return Promise.reject(error);
  }
);

export default axiosWithAuth;
