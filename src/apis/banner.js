import apiClient from "../apis/apiClient.js";

const bannerApi = {
	getBanner: async () => {
		return await apiClient.get("private/banner/get-all");
	},
	createBanner: async (data) => {
		const formData = new FormData();
		Object.entries(data).forEach(([key, value]) => {
			if (key === "image_url" && value instanceof File) {
				formData.append(key, value);
			} else if (
				key === "image_url" &&
				typeof value === "string" &&
				value.startsWith("http")
			) {
				formData.append(key, value);
			} else if (key !== "image_url") {
				formData.append(
					key,
					value === null || value === undefined ? "" : value.toString()
				);
			}
		});
		return await apiClient.post("private/banner/create", formData);
	},
	updateBanner: async (data) => {
		const formData = new FormData();
		Object.entries(data).forEach(([key, value]) => {
			if (key === "image_url" && value instanceof File) {
				formData.append(key, value);
			} else if (
				key === "image_url" &&
				typeof value === "string" &&
				value.startsWith("http")
			) {
				formData.append(key, value);
			} else if (key !== "image_url") {
				formData.append(
					key,
					value === null || value === undefined ? "" : value.toString()
				);
			}
		});
		return await apiClient.post("private/banner/update", formData);
	},
	deleteBanner: async (id) => {
		return await apiClient.delete(`private/banner/delete/${id}`);
	}
};

export default bannerApi;
