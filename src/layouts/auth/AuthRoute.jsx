import {Navigate} from 'react-router-dom';

export default function AuthRoute({children}) {
	const accessToken = localStorage.getItem('accessToken');
	const userInfo = localStorage.getItem('clientId');
	if (accessToken && userInfo) {
		return <Navigate to="/admin/dashboard" replace/>;
	}
	return children;
}
