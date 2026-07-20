import { fetchBaseQuery, createApi } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "../feautures/constants";
import { logout } from "../feautures/auth/authSlice";

const baseQuery = fetchBaseQuery({ baseUrl: BASE_URL });

const baseQueryWithReauth = async (args, api, extraOptions) => {
	let result = await baseQuery(args, api, extraOptions);

	if (result.error && result.error.status === 401) {
		api.dispatch(logout());
	}
	return result;
};

export const apiSlice = createApi({
    baseQuery: baseQueryWithReauth,
    tagTypes: ['Lodges', 'Business', 'Properties', 'Products', 'Services', 'Agent', 'Requests', 'Notifications', 'Reviews'],
    endpoints: () => ({
    })
})