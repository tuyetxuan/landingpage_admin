import React, {Suspense} from 'react';
import {Navigate, Route, Routes} from 'react-router-dom';
import AntdConfig from 'configs/Antd/index.jsx';

import AdminLayout from 'layouts/admin';
import AuthLayout from 'layouts/auth';
import {Spin} from 'antd';

const App = () => {
	return (
		<AntdConfig>
			<Routes>
				<Route path="auth/*" element={
					<Suspense fallback={<Spin fullscreen size="large"/>}>
						<AuthLayout/>
					</Suspense>
				}/>
				<Route path="admin/*" element={
					<Suspense fallback={<Spin fullscreen size="large"/>}>
						<AdminLayout/>
					</Suspense>
				}/>
				<Route path="/" element={<Navigate to="/admin" replace/>}/>
				<Route
					path="*"
					element={
						<div
							className="
        flex h-screen w-full items-center justify-center text-3xl font-semibold text-gray-500
        dark:text-gray-400"
						>
							404 Not Found
						</div>
					}
				/>
			</Routes>
		</AntdConfig>
	);
};

export default App;
