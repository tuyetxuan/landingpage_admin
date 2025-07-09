import React from "react";
import {Avatar, Button, Modal} from "antd";
import {Icon} from "@iconify/react";

const FreeCard = ({infoUser, handleLogOut, isLoadingLogOut}) => {
	const [isModalVisibleLogOut, setIsModalVisibleLogOut] = React.useState(false);
	
	const showModalLogOut = () => {
		setIsModalVisibleLogOut(true);
	};
	
	return (
		<>
			<Modal
				open={isModalVisibleLogOut}
				onCancel={() => setIsModalVisibleLogOut(false)}
				footer={null}
				centered
				closeIcon={false}
			>
				<div style={{textAlign: 'center', padding: '16px 0', display: 'flex', justifyContent: 'center', flexDirection: 'column', alignItems: 'center'}}>
					<Icon icon="solar:logout-bold-duotone" width="80" height="80" style={{color: '#432CF3', marginBottom: 12}}/>
					<p className="text-xl font-bold">Bạn có chắc chắn muốn đăng xuất khỏi tài khoản?</p>
					<div style={{marginTop: 24, display: 'flex', justifyContent: 'center', gap: 12}}>
						<Button
							size="large"
							onClick={() => setIsModalVisibleLogOut(false)}
						>
							Hủy đăng xuất
						</Button>
						<Button
							size="large"
							type="primary"
							onClick={handleLogOut}
						>
							{isLoadingLogOut ? 'Đang xử lý đăng xuất...' : 'Đăng xuất ngay'}
						</Button>
					</div>
				</div>
			</Modal>
			<div className="relative mt-14 flex w-[256px] justify-center rounded-[20px] bg-gradient-to-br from-[#868CFF] via-[#432CF3] to-brand-500 pb-4">
				<div className="absolute -top-12 flex h-[100px] w-[100px] items-center justify-center rounded-full border-[4px] border-white bg-gradient-to-b from-[#868CFF] to-brand-500">
					{
						infoUser?.user?.profile_image ? (
							<Avatar
								shape="circle"
								style={{width: '100%', height: '100%', border: 'none'}}
								src={infoUser?.user?.profile_image}
							/>) : (
							<Avatar
								shape="circle"
								style={{width: '100%', height: '100%'}}
							>
								{infoUser?.user?.last_name?.split(' ').pop()?.charAt(0)?.toUpperCase()}
							</Avatar>)
					}
				</div>
				<div className="mt-16 flex h-fit flex-col items-center">
					<p className="mt-1 px-4 text-center text-sm text-white">
						@{infoUser?.user?.username}
					</p>
					<p className="text-lg font-bold text-white">{infoUser?.user?.first_name + ' ' + infoUser?.user?.last_name}</p>
					<p className="text-sm text-white/80">
						{infoUser?.user?.email}
					</p>
					<button
						onClick={showModalLogOut}
						className="text-medium mt-7 block rounded-full bg-gradient-to-b from-white/50 to-white/10 py-[12px] px-11 text-center text-base text-white hover:bg-gradient-to-b hover:from-white/40 hover:to-white/5 "
					>
						<div className="flex items-center gap-2 justify-center">
							<Icon icon="solar:logout-bold-duotone" width="24" height="24"/>
							<span>Đăng xuất</span>
						</div>
					</button>
				</div>
			</div>
		</>
	);
};

export default FreeCard;
