import apiClient from '../apis/apiClient.js';

const contactApi = {
  getContact: async () => {
    return await apiClient.get('private/contact/get-all');
  },
  updateContact: async (data) => {
    return await apiClient.post('private/contact/update', data);
  },
  createContact: async (data) => {
    return await apiClient.post('private/contact/create', data);
  },
  deleteContact: async (id) => {
    return await apiClient.delete(`private/contact/delete/${id}`);
  },
};

export default contactApi;
