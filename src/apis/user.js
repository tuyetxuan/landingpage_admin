import apiClient from '../apis/apiClient.js';

const userApi = {
	getUser: async () => {
		return await apiClient.get('private/user/get-by-id');
	},
	updateUser: async (data) => {
		const formData = new FormData();
		Object.entries(data).forEach(([key, value]) => {
			if (key === 'profile_image' && value instanceof File) {
				formData.append(key, value);
			} else if (
				key === 'profile_image' &&
				typeof value === 'string' &&
				value.startsWith('http')
			) {
				formData.append(key, value);
			} else if (key !== 'profile_image') {
				formData.append(
					key,
					value === null || value === undefined ? '' : value.toString(),
				);
			}
		});
		return await apiClient.post('private/user/update', formData);
	},
	getAllUsers:
		async () => {
			return await apiClient.get('private/user/get-all');
		},
	createUser: async (data) => {
		return await apiClient.post('private/user/create', data);
	},
	updateUserStatus: async (data) => {
		return await apiClient.post('private/user/update-status', data);
	},
	updateUserRole: async (data) => {
		return await apiClient.post('private/user/update-user-role', data);
	},
	resetPassword: async (data) => {
		return await apiClient.post('private/user/reset-password', data);
	},
	logOut: async (data) => {
		return await apiClient.post('private/user/logout', data);
	},
	changePassword: async (data) => {
		return await apiClient.post('private/user/change-password', data);
	}
};

export default userApi;
