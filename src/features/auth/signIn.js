import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import auth from "../../apis/auth.js";

export const signIn = createApi({
  reducerPath: "Auth",
  baseQuery: fetchBaseQuery({ baseUrl: "" }),
  tagTypes: ["Auth"],
  endpoints: (builder) => ({
    signin: builder.mutation({
      queryFn: async (credentials) => {
        const result = await auth.signIn({
          email: credentials.email,
          password: credentials.password,
        });
        console.log(result);
        if (result.success) {
          const data = result?.data?.metadata;
          localStorage.setItem("accessToken", data.tokens?.accessToken);
          localStorage.setItem("refreshToken", data.tokens?.refreshToken);
          localStorage.setItem("clientId", data.user?.id);
          return { data: result.data?.metadata || [] };
        }
        return { error: { message: result.message, status: result.status } };
      },
      providesTags: ["Auth"],
    }),
  }),
});

export const { useSigninMutation } = signIn;
