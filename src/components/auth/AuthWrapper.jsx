import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useGetMeQuery } from '../../redux/api/agentApiSlice';
import { setCredientials, logout } from '../../redux/feautures/auth/authSlice';
import Spinner from '../spinner';

export default function AuthWrapper({ children }) {
	const dispatch = useDispatch();
	const { data, isLoading, isError, isSuccess, error } = useGetMeQuery(undefined, {
		refetchOnMountOrArgChange: true, // Always verify on hard reload
	});
	const [init, setInit] = useState(false);

	useEffect(() => {
		if (!isLoading) {
			if (isSuccess && data) {
				// Assuming the backend returns the profile object directly or under a key
				const payload = data.agent || data.user || data;
				dispatch(setCredientials(payload));
			} else if (isError && error?.status === 401) {
				dispatch(logout());
			}
			setInit(true);
		}
	}, [isLoading, isSuccess, isError, data, error, dispatch]);

	if (!init || isLoading) {
		return (
			<div className='min-h-screen bg-bg flex items-center justify-center flex-col gap-4'>
				<Spinner />
				<p className='text-muted font-semibold text-sm'>
					Verifying Session...
				</p>
			</div>
		);
	}

	return children;
}
