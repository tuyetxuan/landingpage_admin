import apiClient from '../apis/apiClient.js';

const articleApi = {
  getArticle: async () => {
    return await apiClient.get('private/article/get-all');
  },
  getCategories: async () => {
    return await apiClient.get('private/category/get-all');
  },
  createArticle: async (data) => {
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
    return await apiClient.post('private/article/create', formData);
  },
  updateArticle: async (data) => {
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
    return await apiClient.post('private/article/update', formData);
  },
  deleteArticle: async (id) => {
    return await apiClient.delete(`private/article/delete/${id}`);
  },
};

export default articleApi;
