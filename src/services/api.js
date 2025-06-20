import axios from 'axios';

const API_URL = "http://localhost:8000";  // Backend URL

export const registerUser = (userData) => axios.post(`${API_URL}/register`, userData);
export const loginUser = (userData) => axios.post(`${API_URL}/login`, userData);

export const generateCode = (prompt) => axios.post(`${API_URL}/generate-code`, { prompt });
export const explainCode = (code) => axios.post(`${API_URL}/explain-code`, { code });
export const editCode = (code, instruction) => axios.post(`${API_URL}/edit-code`, { code, instruction });
export const debugCode = (code) => axios.post(`${API_URL}/debug-code`, { code });
