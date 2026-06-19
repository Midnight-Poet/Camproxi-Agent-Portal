import { Navigate, Outlet } from 'react-router';
import { useSelector } from 'react-redux';

export const PrivateRoute = () => {
	const { userInfo } = useSelector((state) => state.auth);
	const isEmpty = (obj) => Object.keys(obj).length === 0;
	return userInfo && !isEmpty(userInfo) ? (
		<Outlet />
	) : (
		<Navigate to='/signin' replace />
	);
};
