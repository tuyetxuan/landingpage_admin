/* eslint-disable */

import {HiX} from 'react-icons/hi';
import Links from './components/Links';
import routes from 'routes.js';
import React from 'react';
import LOGO from 'assets/img/logo/logo.png';
import {useDispatch} from 'react-redux';
import {useGetUserQuery, useLogOutMutation} from '../../features/user/user';
import {Spin} from 'antd';
import {handleLogout} from '../../views/admin/logoutUtils';
import SidebarCard from './components/SidebarCard';
import {useNavigate} from "react-router-dom";

const Sidebar = ({open, onClose}) => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const {data: InfoUser = [], error, isLoading} = useGetUserQuery();
	const [submitLogOut, {isLoading: isLoadingLogOut}] = useLogOutMutation();
	
	const handleLogOut = async () => {
		try {
			await submitLogOut({
				id: InfoUser?.user?.id,
			}).unwrap();
			await handleLogout(dispatch);
		} catch (error) {
			console.error('Error during logout:', error);
		}
	};
	
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
			<div
				className={`sm:none duration-175 linear fixed !z-50 flex min-h-full flex-col bg-white pb-10 shadow-2xl shadow-white/5 transition-all dark:!bg-navy-800 dark:text-white md:!z-50 lg:!z-50 xl:!z-0 ${
					open ? 'translate-x-0' : '-translate-x-96'
				}`}
			>
      <span
	      className="absolute right-4 top-4 block cursor-pointer xl:hidden"
	      onClick={onClose}
      >
        <HiX/>
      </span>
				
				<div className={`mx-[15px] mt-[20px] flex flex-col items-center cursor-pointer`}
				     onClick={() => {
					     navigate('/admin');
				     }}
				>
					<div className="ml-1 mt-1 h-2.5 text-center font-poppins text-[26px] font-bold uppercase text-navy-700 dark:text-white">
						<img
							src={LOGO}
							alt="Admin Icon"
							className="mr-2 inline-block h-14 w-14 align-middle"
						/>
						<span className="font-bold text-brand-800">LANDING PAGE</span>
					</div>
				</div>
				<div className="mb-7 mt-[58px] h-px bg-gray-300 dark:bg-white/30"/>
				<ul className="mb-auto pt-1">
					<Links routes={routes}/>
				</ul>
				<div className="flex justify-center">
					
					{
						isLoading ? (
							<div className="flex flex-col gap-5 items-center justify-center h-28 w-full">
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
                  Đang tải thông tin người dùng...
                </span>
							</div>
						) : (
							<SidebarCard infoUser={InfoUser} handleLogOut={handleLogOut} isLoadingLogOut={isLoadingLogOut}/>
						)
					}
				</div>
			</div>
		</>
	);
};

export default Sidebar;
