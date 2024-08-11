import axios, { AxiosError } from "axios";

const baseURL = "http://localhost:8000";

const api = axios.create({
  baseURL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export interface signUpCredentials {
  username: string;
  email: string;
  password: string;
}
export const signUp = async (credentials: signUpCredentials) => {
  try {
    const response = await api.post("/users/signup", credentials);
    return response.data;
  } catch (er) {
    if (er instanceof AxiosError) {
      console.error(er.response?.data.message);
      throw new Error(er.response?.data.message);
    }
  }
};

export interface loginCredentials {
  username: string;
  password: string;
}
export const login = async (credentials: loginCredentials) => {
  try {
    const response = await api.post("/users/login", credentials);
    return response.data;
  } catch (er) {
    if (er instanceof AxiosError) {
      console.error(er.response?.data.message);
      throw new Error(er.response?.data.message);
    }
  }
};

export const logout = async () => {
  try {
    const response = await api.post("/users/logout");
    return response.data;
  } catch (er) {
    if (er instanceof AxiosError) {
      console.error(er.response?.data.message);
      throw new Error(er.response?.data.message);
    }
  }
};

export const getLoggedInUser = async () => {
  try {
    const response = await api.get("/users/loggedInUser");
    return response.data.user;
  } catch (er) {
    if (er instanceof AxiosError) {
      console.error(er.response?.data.message);
      throw new Error(er.response?.data.message);
    }
  }
};

export const authWithGithub = async (code: string) => {
  try {
    const response = await api.get(`/users/auth?code=${code}`);
    return response.data;
  } catch (er) {
    if (er instanceof AxiosError) {
      console.error(er.response?.data.message);
      throw new Error(er.response?.data.message);
    }
  }
};

export const uploadFiles = async (
  fileName: string,
  fileId: string,
  userId: string
) => {
  try {
    const response = await api.post(`/users/saveFiles/${userId}`, {
      fileId,
      fileName,
    });
    return response.data;
  } catch (er) {
    if (er instanceof AxiosError) {
      console.error(er.response?.data.message);
      throw new Error(er.response?.data.message);
    }
  }
};
