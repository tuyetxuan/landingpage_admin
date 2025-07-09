import {MdBarChart, MdGroups} from 'react-icons/md';
import AnimatedNumbers from 'react-animated-numbers';
import Widget from 'components/widget/Widget';
import UserProfileCard from './UserProfileCard';
import {useGetUserQuery, useReportQuery} from '../../../features/user/user';
import {TypeAnimation} from 'react-type-animation';
import Auth_Img from '../../../assets/img/auth/dashboard.png';
import React from 'react';

const Dashboard = () => {
	const {
		data: InfoUser = [],
		error,
		isLoading: userIsLoading,
	} = useGetUserQuery();
	
	const {
		data: userReport = [],
		error: reportError,
		isLoading: reportIsLoading,
	} = useReportQuery(
		undefined,
		{
			pollingInterval: 2000,
		}
	);
	
	if (userIsLoading || reportIsLoading) {
		console.log('Loading user or report data...');
	}
	
	return (
		<div>
			<div className="mt-3 grid grid-cols-6 gap-4">
				<Widget
					icon={<MdBarChart className="h-9 w-9"/>}
					title={'Total Users'}
					subtitle={(
						<AnimatedNumbers
							useThousandsSeparator
							transitions={(index) => ({
								type: 'spring',
								duration: index + 0.3,
							})}
							animateToNumber={userReport?.totalUsers || 0}
						/>
					)}
				/>
				<Widget
					icon={<MdBarChart className="h-9 w-9"/>}
					title={'Total Contact'}
					subtitle={(
						<AnimatedNumbers
							useThousandsSeparator
							transitions={(index) => ({
								type: 'spring',
								duration: index + 0.3,
							})}
							animateToNumber={userReport?.totalContact || 0}
						/>
					)}
				/>
				<Widget
					icon={<MdBarChart className="h-9 w-9"/>}
					title={'Total Services'}
					subtitle={(
						<AnimatedNumbers
							useThousandsSeparator
							transitions={(index) => ({
								type: 'spring',
								duration: index + 0.3,
							})}
							animateToNumber={userReport?.totalService || 0}
						/>
					)}
				/>
				<Widget
					icon={<MdBarChart className="h-9 w-9"/>}
					title={'Total Articles'}
					subtitle={(
						<AnimatedNumbers
							useThousandsSeparator
							transitions={(index) => ({
								type: 'spring',
								duration: index + 0.3,
							})}
							animateToNumber={userReport?.totalArticles || 0}
						/>
					)}
				/>
				<Widget
					icon={<MdGroups className="h-9 w-9"/>}
					title={'Total Users Admin'}
					subtitle={(
						<AnimatedNumbers
							useThousandsSeparator
							transitions={(index) => ({
								type: 'spring',
								duration: index + 0.3,
							})}
							animateToNumber={userReport?.userCountByRole?.find(
								(item) => item.roleName === 'admin',
							)?.count || 0}
						/>
					)}
				/>
				<Widget
					icon={<MdGroups className="h-9 w-9"/>}
					title={'Total Users Editors'}
					subtitle={(
						<AnimatedNumbers
							useThousandsSeparator
							transitions={(index) => ({
								type: 'spring',
								duration: index + 0.3,
							})}
							animateToNumber={userReport?.userCountByRole?.find(
								(item) => item.roleName === 'editor',
							)?.count || 0}
						/>
					)}
				/>
			</div>
			<div className="flex items-center justify-center min-h-[100px] mt-4 rounded-[20px] bg-white bg-clip-border shadow-3xl shadow-shadow-500">
				{
					userIsLoading ? (
						<div className="flex flex-col gap-5 items-center justify-center h-28 w-full">
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
					) : error ? (
						<span className="text-red-500">Lỗi khi tải thông tin người dùng</span>
					) : (
						<TypeAnimation
							sequence={[
								`Xin chào, ${InfoUser?.user?.first_name + "  " + InfoUser?.user?.last_name || 'Người dùng'}!`,
								2000,
								`Chào mừng bạn đến với hệ thống quản trị Admin!`,
								2000,
							]}
							wrapper="span"
							speed={50}
							style={{fontSize: '2em', display: 'inline-block', color: '#432AFB', fontWeight: 'bold', fontFamily: 'Pacifico, cursive'}}
							repeat={Infinity}
						/>
					)
				}
			</div>
			<div className="grid grid-cols-12 gap-4 min-h-[500px] mt-4">
				<div className="col-span-9 p-5 flex items-center justify-center rounded-[20px] bg-white bg-clip-border shadow-3xl shadow-shadow-500">
					<div className="flex h-full w-full flex-col items-center justify-center gap-20">
						<img
							src={Auth_Img}
							alt="Login"
							className="hidden h-[100%] w-full max-w-[400px] object-cover md:block"
						/>
						<h3 className="text-3xl font-bold text-brand-600" style={{fontFamily: 'Pacifico, cursive'}}>
							Hệ thống quản trị Admin - Admin Dashboard
						</h3>
					</div>
				</div>
				<div className="col-span-3 flex items-center justify-center rounded-[20px] bg-white bg-clip-border shadow-3xl shadow-shadow-500">
					<UserProfileCard user={
						{
							username: InfoUser?.user?.username || 'N/A',
							email: InfoUser?.user?.email || 'N/A',
							first_name: InfoUser?.user?.first_name || 'N/A',
							last_name: InfoUser?.user?.last_name || 'N/A',
							profile_image: InfoUser?.user?.profile_image || null,
							gender: InfoUser?.user?.gender === 'nam' ? 'Nam' : InfoUser?.user?.gender === 'nu' ? 'Nữ' : 'Khác',
							role: InfoUser?.user?.role || 'N/A',
							is_active: InfoUser?.user?.is_active ? 'Đang hoạt động' : 'Không hoạt động',
							created_at: InfoUser?.user?.created_at,
						}
					}/>
				</div>
			</div>
		</div>
	
	);
};

export default Dashboard;
