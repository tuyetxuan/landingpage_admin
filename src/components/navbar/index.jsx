import React from 'react';
import Dropdown from 'components/dropdown';
import {Link, useNavigate} from 'react-router-dom';
import {useGetUserQuery, useLogOutMutation} from '../../features/user/user';
import {Avatar, Spin} from 'antd';
import {Icon} from '@iconify/react';
import {useDispatch} from 'react-redux';
import {handleLogout} from '../../views/admin/logoutUtils';

const Navbar = (props) => {
	const {onOpenSidenav, brandText} = props;
	const dispatch = useDispatch();
	const [darkmode, setDarkmode] = React.useState(false);
	const {data: InfoUser = [], error, isLoading} = useGetUserQuery();
	const [submitLogOut, {isLoading: isLoadingLogOut}] = useLogOutMutation();
	const navigate = useNavigate();
	
	
	return (
		<>
			{isLoadingLogOut && (
				<div
					style={{
						position: 'fixed',
						top: 0,
						left: 0,
						width: '100vw',
						height: '100vh',
						background: 'rgba(255, 255, 255, 0.7)',
						zIndex: 9999,
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
						flexDirection: 'column',
					}}
				>
					<Spin size="large"/>
					<span
						style={{
							fontSize: 16,
							fontWeight: 500,
							color: '#3024db',
							marginTop: 12,
							textAlign: 'center',
						}}
					>
            Đang đăng xuất, vui lòng đợi...
          </span>
				</div>
			)}
			<nav className="sticky top-4 z-40 flex flex-row flex-wrap items-center justify-between rounded-xl bg-white/10 p-2 backdrop-blur-xl dark:bg-[#0b14374d]">
				<div className="ml-[6px]">
					<div className="h-6 w-[224px] pt-1">
						<a
							className="text-sm font-normal text-navy-700 hover:underline dark:text-white dark:hover:text-white"
							href=" "
						>
							Pages
							<span className="mx-1 text-sm text-navy-700 hover:text-navy-700 dark:text-white">
              {' '}
								/{' '}
            </span>
						</a>
						<Link
							className="text-sm font-normal capitalize text-navy-700 hover:underline dark:text-white dark:hover:text-white"
							to="#"
						>
							{brandText}
						</Link>
					</div>
					<p className="shrink text-[33px] capitalize text-navy-700 dark:text-white">
						<Link
							to="#"
							className="font-bold capitalize hover:text-navy-700 dark:hover:text-white"
						>
							{brandText}
						</Link>
					</p>
				</div>
				
				<div className="relative mt-[3px] flex h-[61px] flex-grow-0 cursor-pointer items-center justify-around gap-3 rounded-full bg-white px-2 py-2 shadow-xl shadow-shadow-500 dark:shadow-none">
					<div className="flex h-full items-center rounded-full bg-lightPrimary px-2 text-navy-700 hover:bg-brand-500 hover:text-white">
						<p className="text-l px-2  ">
							👋 Hey,{' '}
							{InfoUser?.user?.first_name + ' ' + InfoUser?.user?.last_name}
						</p>
					</div>
					<Dropdown
						button={
							InfoUser?.user?.profile_image ? (<Avatar
								size={50}
								src={InfoUser?.user?.profile_image}
								className="ring-4 ring-white"
							/>) : (
								<Avatar
									style={{
										backgroundColor: `#${Math.floor(Math.random() * 16777215).toString(16)}`,
										verticalAlign: 'middle',
									}}
									size="large"
								>
									{InfoUser?.user?.last_name?.split(' ').pop()?.charAt(0)?.toUpperCase()}
								</Avatar>)
						}
						children={
							<>
								<div className="flex w-[272px] flex-col justify-start rounded-[20px] bg-white bg-cover bg-no-repeat shadow-2xl shadow-shadow-800">
									<div className="p-4">
										<div className="flex items-center gap-2">
											<p className="text-sm font-bold text-navy-700 dark:text-white">
												👋 Hey,{' '}
												{InfoUser?.user?.first_name +
													' ' +
													InfoUser?.user?.last_name}
											</p>{' '}
										</div>
									</div>
									<div className="h-px w-full bg-gray-200 dark:bg-white/20 "/>
									
									<div className="flex flex-col p-4">
										<div className="flex flex-col gap-2">
											{[
												{
													icon: <Icon icon="mdi:email" width="24" height="24" style={{color: '#3b82f6'}}/>,
													label: 'Email',
													value: InfoUser?.user?.email || 'Email not available',
												},
												{
													icon: <Icon icon="mdi:gender-male-female" width="24" height="24" style={{color: '#f59e42'}}/>,
													label: 'Gender',
													value:
														InfoUser?.user?.gender === 'nam'
															? 'Nam'
															: InfoUser?.user?.gender === 'nu'
																? 'Nữ'
																: 'Khác',
												},
												{
													icon: <Icon icon="mdi:account-badge" width="24" height="24" style={{color: '#10b981'}}/>,
													label: 'Role',
													value: InfoUser?.user?.role === 'admin' ? 'Admin' : 'Editor',
												},
												{
													icon: (
														<Icon
															icon="mdi:checkbox-marked-circle"
															width="24"
															height="24"
															style={{color: InfoUser?.user?.is_active ? '#22c55e' : '#ef4444'}}
														/>
													),
													label: 'Status',
													value: InfoUser?.user?.is_active ? 'Active' : 'Inactive',
												},
											].map((item, idx) => (
												<div className="flex items-center gap-2" key={item.label}>
													{item.icon}
													<span className="text-sm text-gray-800 dark:text-white">
                            {item.label}:{' '}
														<span
															style={{
																fontWeight: 'bold',
															}}
															title={item.value}
														>
                              {typeof item.value === 'string' && item.value.length > 20
	                              ? item.value.slice(0, 20) + ' ...'
	                              : item.value}
                            </span>
                          </span>
												</div>
											))}
										</div>
										<button
											onClick={async () => {
												try {
													await submitLogOut({
														id: InfoUser?.user?.id,
													}).unwrap();
													await handleLogout(dispatch);
												} catch (error) {
													console.error('Error during logout:', error);
												}
											}}
											className="mt-3 text-sm p-2 rounded-xl font-medium bg-red-200 text-red-600 transition duration-150 ease-out hover:bg-red-300 hover:ease-in"
										>
											<div className="flex items-center gap-2 justify-center">
												<Icon icon="solar:logout-bold-duotone" width="24" height="24" style={{color: 'red'}}/>
												<span>Log Out</span>
											</div>
										</button>
									</div>
								</div>
							</>
						}
						classNames={'py-2 top-10 -left-[240px] w-max'}
					/>
				</div>
			</nav>
		</>
	);
};

export default Navbar;
