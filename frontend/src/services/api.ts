import axios from "axios";

const API_BASE_URL = "http://localhost:4000";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const fetchFormStructure = async (formType?: string) => {
  const response = await api.get(
    `/api/insurance/forms${formType ? `?type=${formType}` : ""}`
  );
  return response.data;
};

export const submitForm = async (formData: any) => {
  const response = await api.post("/api/insurance/forms/submit", formData);
  return response.data;
};

export const fetchSubmissions = async (formType?: string) => {
  const response = await api.get(`/api/insurance/forms/submissions${formType ? `?type=${formType}` : ""}`);
  return response.data;
};

export default api;
