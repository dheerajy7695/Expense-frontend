import api from "./api";
import { API } from "../utils/APIRequest";

// Fetch all users
export const getTransactions = async (data) => {
  const response = await api.post(API.TRANSACTION.LIST, data);
  return response.data;
};

// Create transaction
export const createTransaction = async (data) => {
  const res = await api.post(API.TRANSACTION.CREATE, data);
  return res.data;
};

// Update transaction
export const updateTransaction = async (id, data) => {
  const res = await api.put(API.TRANSACTION.UPDATE(id), data);
  return res.data;
};

// Delete transaction
export const deleteTransaction = async (id) => {
  const res = await api.delete(API.TRANSACTION.DELETE(id));
  return res.data;
};

// Get Transaction by ID
export const getTransactionById = async (id) => {
  const res = await api.get(API.TRANSACTION.GET_BY_ID(id));
  return res.data;
};
