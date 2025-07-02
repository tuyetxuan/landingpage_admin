import apiClient from '../apis/apiClient.js';

const categoryArticleApi = {
  getCategories: async () => {
    return await apiClient.get('private/categoryArticle/get-all');
  },
};

export default categoryArticleApi;
