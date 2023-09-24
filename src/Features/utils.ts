import Axios from "axios";

const baseURL = "https://bookings.merredinmedicalcentre.com.au/";

export const axios = Axios.create({ baseURL });

export const axiosWithAuth = (token: string) =>
  Axios.create({
    baseURL,
    timeout: 10000,
    headers: {
      Authorization: "Bearer " + token,
    },
  });
