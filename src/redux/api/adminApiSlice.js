import { ADMIN_URL } from '../feautures/constants';
import { apiSlice } from './apiSlice';

export const adminApiSlice = apiSlice.injectEndpoints({
	endpoints: (builder) => ({
		getSchools: builder.query({
			query: () => ({
				url: `${ADMIN_URL}/school`,
				method: 'GET',
			}),
		}),
	}),
});

export const { useGetSchoolsQuery } = adminApiSlice;
