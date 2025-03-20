import axios from "axios";

const apiClient = (authToken?: string) => {
  return axios.create({
    baseURL: "https://healthcare-backend-a66n.onrender.com/api",
    headers: authToken ? { Authorization: `Bearer ${authToken}` } : {},
  });
};

export default apiClient;
