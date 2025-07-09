import React, {Suspense} from 'react';
import {Navigate, Route, Routes} from 'react-router-dom';
import AntdConfig from 'configs/Antd/index.jsx';
import {Spin} from 'antd';

const AuthRoute = React.lazy(() => import('layouts/auth/AuthRoute'));
const AdminLayout = React.lazy(() => import('layouts/admin'));
const AuthLayout = React.lazy(() => import('layouts/auth'));

const App = () => {
	return (
		<AntdConfig>
			<Routes>
				<Route
					path="auth/*"
					element={
						<Suspense
							fallback={
								<div style={{height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
									<Spin size="large"/>
								</div>
							}
						>
							<AuthRoute>
								<AuthLayout/>
							</AuthRoute>
						</Suspense>
					}
				/>
				<Route
					path="admin/*"
					element={
						<Suspense
							fallback={
								<div style={{height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
									<Spin size="large"/>
								</div>
							}
						>
							<AdminLayout/>
						</Suspense>
					}
				/>
				<Route path="/" element={<Navigate to="/admin" replace/>}/>
				<Route
					path="*"
					element={
						<div className="flex h-screen w-full items-center justify-center text-3xl font-semibold text-gray-500 dark:text-gray-400">
							404 Not Found
						</div>
					}
				/>
			</Routes>
		</AntdConfig>
	);
};

export default App;
