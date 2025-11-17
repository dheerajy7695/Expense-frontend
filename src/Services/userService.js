import api from "./api";
import { API } from "../utils/APIRequest";

// Fetch all users
export const getUsers = async () => {
  const response = await api.get(API.USERS.LIST);
  return response.data;
};

// Create user
export const createUser = async (data) => {
  const res = await api.post(API.USERS.CREATE, data);
  return res.data;
};

// Update user
export const updateUser = async (id, data) => {
  const res = await api.patch(API.USERS.UPDATE(id), data);
  return res.data;
};

// Delete user
export const deleteUser = async (id) => {
  const res = await api.delete(API.USERS.DELETE(id));
  return res.data;
};

// Get user by ID
export const getUserById = async (id) => {
  const res = await api.get(API.USERS.GET_BY_ID(id));
  return res.data;
};