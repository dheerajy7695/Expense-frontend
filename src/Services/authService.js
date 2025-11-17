import api from "./api";
import { API } from "../utils/APIRequest";

export const loginUser = async (credentials) => {
  const res = await api.post(API.AUTH.LOGIN, credentials);
  return res.data;
};

export const registerUser = async (requestData) => {
  const res = await api.post(API.AUTH.REGISTER, requestData);
  return res.data;
};
