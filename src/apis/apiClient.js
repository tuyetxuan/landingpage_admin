import axiosInstance from "../configs/axios/axiosConfig";

const handleError = (error) => {
  const errorResponse = error.response?.data || {
    message: "Something went wrong",
  };
  return {
    success: false,
    message: errorResponse.message || "Unknown error",
    status: error.response?.status || 500,
  };
};

const handleResponse = (response) => ({
  success: true,
  data: response.data,
  status: response.status,
});

const get = async (url, params = {}) => {
  try {
    const response = await axiosInstance.get(url, { params });
    return handleResponse(response);
  } catch (error) {
    return handleError(error);
  }
};

const post = async (url, data = {}) => {
  try {
    const response = await axiosInstance.post(url, data);
    return handleResponse(response);
  } catch (error) {
    return handleError(error);
  }
};

const put = async (url, data = {}) => {
  try {
    const response = await axiosInstance.put(url, data);
    return handleResponse(response);
  } catch (error) {
    return handleError(error);
  }
};

const del = async (url, params = {}) => {
  try {
    const response = await axiosInstance.delete(url, { params });
    return handleResponse(response);
  } catch (error) {
    return handleError(error);
  }
};

export default {
  get,
  post,
  put,
  delete: del,
};
