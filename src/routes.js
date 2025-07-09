import React, {Suspense} from 'react';
import MainDashboard from 'views/admin/default';
import {MdAmpStories, MdContactMail, MdNewspaper, MdPeople, MdSensorOccupied, MdWindow} from 'react-icons/md';
import {Spin} from 'antd';

const User = React.lazy(() => import('views/admin/user'));
const Article = React.lazy(() => import('views/admin/article'));
const Service = React.lazy(() => import('views/admin/service'));
const Profile = React.lazy(() => import('views/admin/profile'));
const Banner = React.lazy(() => import('views/admin/banner'));
const SignIn = React.lazy(() => import('views/auth/SignIn'));
const Contact = React.lazy(() => import('views/admin/contact'));

const routes = [
	{
		name: 'Main Dashboard',
		layout: 'admin',
		path: 'dashboard',
		icon: <MdWindow className="h-6 w-6"/>,
		component: (
			<Suspense fallback={<div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '70vh'}}>
				<Spin size="large"/>
			</div>}>
				<MainDashboard/>
			</Suspense>
		),
		role: ['admin', 'editor'],
	},
	{
		name: 'Banner Data',
		layout: 'admin',
		path: 'banner',
		icon: <MdAmpStories className="h-6 w-6"/>,
		component: (
			<Suspense fallback={<div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '70vh'}}>
				<Spin size="large"/>
			</div>}>
				<Banner/>
			</Suspense>
		),
		secondary: true,
		role: ['admin'],
	},
	{
		name: 'User Data',
		layout: 'admin',
		icon: <MdPeople className="h-6 w-6"/>,
		path: 'user',
		component: (
			<Suspense fallback={<div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '70vh'}}>
				<Spin size="large"/>
			</div>}>
				<User/>
			</Suspense>
		),
		role: ['admin'],
	},
	{
		name: 'Contact Data',
		layout: 'admin',
		icon: <MdContactMail className="h-6 w-6"/>,
		path: 'contact',
		component: (
			<Suspense fallback={<div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '70vh'}}>
				<Spin size="large"/>
			</div>}>
				<Contact/>
			</Suspense>
		),
		role: ['admin'],
	},
	{
		name: 'Article Data',
		layout: 'admin',
		path: 'article',
		icon: <MdNewspaper className="h-6 w-6"/>,
		component:
			<Suspense fallback={
				<div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '70vh'}}>
					<Spin size="large"/>
				</div>
			}>
				<Article/>
			</Suspense>,
		role: ['admin', 'editor'],
	},
	// {
	// 	name: 'Service Data',
	// 	layout: 'admin',
	// 	path: 'service',
	// 	icon: <MdNewspaper className="h-6 w-6"/>,
	// 	component:
	// 		<Suspense fallback={
	// 			<div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '70vh'}}>
	// 				<Spin size="large"/>
	// 			</div>
	// 		}>
	// 			<Service/>
	// 		</Suspense>,
	// 	role: ['admin'],
	// },
	{
		name: 'Profile',
		layout: 'admin',
		path: 'profile',
		icon: <MdSensorOccupied className="h-6 w-6"/>,
		component:
			<Suspense fallback={<div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '70vh'}}>
				<Spin size="large"/>
			</div>}>
				<Profile/>
			</Suspense>,
		role: ['admin', 'editor'],
	},
	{
		name: 'Sign In',
		layout: 'auth',
		path: 'sign-in',
		icon: <MdSensorOccupied className="h-6 w-6"/>,
		component: (
			<Suspense fallback={<div style={{height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
				<Spin size="large"/>
			</div>}>
				<SignIn/>
			</Suspense>
		),
	},
];
export default routes;
