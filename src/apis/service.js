import apiClient from '../apis/apiClient.js';

const serviceApi = {
  getService: async () => {
    return await apiClient.get('private/service/get-all');
  },
  getCategories: async () => {
    return await apiClient.get('private/service/get-all');
  },
  createService: async (data) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (key === 'thumbnail_url' && value instanceof File) {
        formData.append(key, value);
      } else if (
        key === 'thumbnail_url' &&
        typeof value === 'string' &&
        value.startsWith('http')
      ) {
        formData.append(key, value);
      } else if (key !== 'thumbnail_url') {
        formData.append(
          key,
          value === null || value === undefined ? '' : value.toString(),
        );
      }
    });
    return await apiClient.post('private/service/create', formData);
  },
  updateService: async (data) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (key === 'thumbnail_url' && value instanceof File) {
        formData.append(key, value);
      } else if (
        key === 'thumbnail_url' &&
        typeof value === 'string' &&
        value.startsWith('http')
      ) {
        formData.append(key, value);
      } else if (key !== 'thumbnail_url') {
        formData.append(
          key,
          value === null || value === undefined ? '' : value.toString(),
        );
      }
    });
    return await apiClient.post('private/service/update', formData);
  },
  deleteService: async (id) => {
    return await apiClient.delete(`private/service/delete/${id}`);
  },
};

export default serviceApi;
