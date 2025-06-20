import axios from 'axios';

const API_URL = 'http://localhost:8000';

export const registerUser = (email, password) => {
  return axios.post(`${API_URL}/register?email=${email}&password=${password}`);
};

export const loginUser = (email, password) => {
  return axios.post(`${API_URL}/login?email=${email}&password=${password}`);
};

export const getProjects = (token) => {
  return axios.get(`${API_URL}/projects`, { headers: { token } });
};

export const createProject = (token, data) => {
  return axios.post(`${API_URL}/projects`, data, { headers: { token } });
};

export const getProjectById = (token, id) => {
  return axios.get(`${API_URL}/projects/${id}`, { headers: { token } });
};
