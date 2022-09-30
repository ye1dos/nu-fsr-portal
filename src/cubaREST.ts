import { initializeApp } from "@cuba-platform/rest";
import { CUBA_APP_URL, CUBA_APP_URL_V2 } from "./config";
const axios = require("axios").default;

export const cubaREST = initializeApp({
  name: "fsr",
  apiUrl: CUBA_APP_URL,
  storage: window.localStorage,
});

export const myCuba = axios.create({
  baseURL: CUBA_APP_URL_V2,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json;charset=UTF-8",
  },
});
