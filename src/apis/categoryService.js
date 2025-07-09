import apiClient from '../apis/apiClient.js';

const categoryServiceApi = {
  getCategories: async () => {
    return await apiClient.get('private/categoryService/get-all');
  },
};

export default categoryServiceApi;
