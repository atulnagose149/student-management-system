// src/services/api.js
import axios from "axios";

const API_URL = "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Student API
export const studentApi = {
  getAll: (page = 1, limit = 10) =>
    api.get(`/students?page=${page}&limit=${limit}`),
  getById: (id) => api.get(`/students/${id}`),
  create: (data) => api.post("/students", data),
  update: (id, data) => api.put(`/students/${id}`, data),
  delete: (id) => api.delete(`/students/${id}`),
};

// Mark API
export const markApi = {
  getByStudentId: (studentId) => api.get(`/marks/student/${studentId}`),
  create: (data) => api.post("/marks", data),
  update: (id, data) => api.put(`/marks/${id}`, data),
  delete: (id) => api.delete(`/marks/${id}`),
};

// Subject API
export const subjectApi = {
  getAll: () => api.get("/subjects"),
  getById: (id) => api.get(`/subjects/${id}`),
  create: (data) => api.post("/subjects", data),
};

export default api;
