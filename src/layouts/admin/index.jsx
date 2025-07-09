import React, {useEffect, useState} from 'react';
import {Navigate, Route, Routes, useLocation, useNavigate} from 'react-router-dom';
import {Spin} from 'antd';

import Navbar from 'components/navbar';
import Sidebar from 'components/sidebar';
import Footer from 'components/footer/Footer';
import routes from 'routes.js';
import {useGetUserQuery} from '../../features/user/user';

export default function Admin(props) {
	const location = useLocation();
	const navigate = useNavigate();
	const [open, setOpen] = useState(true);
	const [currentRoute, setCurrentRoute] = useState('Main Dashboard');
	
	const {
		data: InfoUser = null,
		error,
		isLoading,
		isError,
	} = useGetUserQuery();
	
	useEffect(() => {
		if (error) {
			localStorage.clear();
		}
	}, [error]);
	
	useEffect(() => {
		window.addEventListener('resize', () =>
			window.innerWidth < 1200 ? setOpen(false) : setOpen(true),
		);
		return () => window.removeEventListener('resize', () => {
		});
	}, []);
	
	useEffect(() => {
		getActiveRoute(routes);
	}, [location.pathname]);
	
	const getActiveRoute = (routes) => {
		for (let i = 0; i < routes.length; i++) {
			if (
				window.location.href.indexOf(
					routes[i].layout + '/' + routes[i].path,
				) !== -1
			) {
				setCurrentRoute(routes[i].name);
			}
		}
	};
	
	const getActiveNavbar = (routes) => {
		for (let i = 0; i < routes.length; i++) {
			if (
				window.location.href.indexOf(routes[i].layout + routes[i].path) !== -1
			) {
				return routes[i].secondary;
			}
		}
		return false;
	};
	
	const getRoutes = (routes) => {
		return routes.map((prop, key) => {
			if (prop.layout === 'admin') {
				return <Route path={`/${prop.path}`} element={prop.component} key={key}/>;
			}
			return null;
		});
	};
	
	if (isLoading) {
		return (
			<div style={{height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
				<Spin size="large"/>
			</div>
		);
	}
	
	if (isError) return null;
	
	return (
		<div className="flex h-full w-full">
			<Sidebar open={open} onClose={() => setOpen(false)}/>
			<div className="h-full w-full bg-lightPrimary dark:!bg-navy-900">
				<main className={`mx-[12px] h-full flex-none transition-all md:pr-2 xl:ml-[313px]`}>
					<div className="h-full">
						<Navbar
							onOpenSidenav={() => setOpen(true)}
							logoText={'Admin Dashboard'}
							brandText={currentRoute}
							secondary={getActiveNavbar(routes)}
							{...props}
						/>
						<div className="mx-auto mb-auto h-full min-h-[84vh] p-3 pt-5">
							<Routes>
								{getRoutes(routes)}
								<Route
									path="/"
									element={
										location.pathname === '/admin' ? (
											<Navigate to="/admin/dashboard" replace/>
										) : null
									}
								/>
							</Routes>
						</div>
						<div className="p-3">
							<Footer/>
						</div>
					</div>
				</main>
			</div>
		</div>
	);
}
