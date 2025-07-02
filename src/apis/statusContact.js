import apiClient from '../apis/apiClient.js';

const statusContactApi = {
  getStatusContact: async () => {
    return await apiClient.get('private/submission_status/get-all');
  },
};

export default statusContactApi;
