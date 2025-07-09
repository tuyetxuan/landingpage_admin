import apiClient from "../apis/apiClient.js";

const auth = {
	signIn: async ({email, password}) => {
		return await apiClient.post("public/auth/sign-in", {
			email,
			password,
		});
	}
};

export default auth;
