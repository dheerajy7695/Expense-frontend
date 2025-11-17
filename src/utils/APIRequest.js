export const BASE_URL = "http://localhost:5000/api";

export const API = {
  AUTH: {
    LOGIN: "/auth/login",
    LOGOUT: "/auth/logout",
    REGISTER: "/user/register",
  },
  USERS: {
    LIST: "/user/list",
    CREATE: "/user/register",
    UPDATE: (id) => `/user/update/${id}`,
    DELETE: (id) => `/user/delete/${id}`,
    GET_BY_ID: (id) => `/user/profile/${id}`,
  },
  TRANSACTION: {
    LIST: "/transactions/getAll",
    CREATE: "/transactions/create",
    UPDATE: (id) => `/transactions/update/${id}`,
    DELETE: (id) => `/transactions/delete/${id}`,
    GET_BY_ID: (id) => `/transactions/get/${id}`,
  },
};
