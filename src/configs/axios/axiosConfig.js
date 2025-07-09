'use strict';

import axios from 'axios';

const axiosInstance = axios.create({
	baseURL: 'http://localhost:5551/api/v1/',
	timeout: 10000,
});

let refreshTokenRequest = null;

axiosInstance.interceptors.request.use(
	(config) => {
		const accessToken = localStorage.getItem('accessToken');
		const userInfo = localStorage.getItem('clientId');
		if (accessToken && userInfo) {
			config.headers['authorization'] = `${accessToken}`;
			config.headers['client_id'] = `${userInfo}`;
		} else {
			console.warn('No access token or client ID found in localStorage');
		}
		return config;
	},
	(error) => {
		console.error('Request error:', error);
		return Promise.reject(error);
	},
);

// Response interceptor to handle errors
axiosInstance.interceptors.response.use(
	(response) => {
		return response; // Return response data directly
	},
	async (error) => {
		const originalRequest = error.config;
		const status = error.response?.status;
		const errorMessage = error.response?.data?.message || 'Unknown error';
		if (status === 419 && !originalRequest._retry) {
			originalRequest._retry = true;
			try {
				refreshTokenRequest =
					refreshTokenRequest ||
					axiosInstance.post('public/auth/refresh-token', {
						refresh_token: localStorage.getItem('refreshToken'),
						client_id: localStorage.getItem('clientId'),
					});
				
				const response = await refreshTokenRequest;
				const {access_token} = response?.data?.metadata;
				localStorage.setItem('accessToken', access_token);
				refreshTokenRequest = null;
				
				originalRequest.headers['authorization'] = access_token;
				originalRequest.headers['client_id'] = localStorage.getItem('clientId');
				return axiosInstance(originalRequest);
			} catch (refreshError) {
				localStorage.removeItem('accessToken');
				localStorage.removeItem('refreshToken');
				localStorage.removeItem('clientId');
				refreshTokenRequest = null;
				window.location.href = '/auth/sign-in';
				return Promise.reject(refreshError || refreshError);
			}
		}
		
		if (status === 401) {
			localStorage.removeItem('accessToken');
			localStorage.removeItem('refreshToken');
			localStorage.removeItem('clientId');
			window.location.href = '/auth/sign-in';
			return Promise.reject(error);
		}
		
		if (status === 403) {
			localStorage.removeItem('accessToken');
			localStorage.removeItem('refreshToken');
			localStorage.removeItem('clientId');
			window.location.href = '/auth/sign-in';
			return Promise.reject(error);
		}
		return Promise.reject(error);
	},
);

export default axiosInstance;
