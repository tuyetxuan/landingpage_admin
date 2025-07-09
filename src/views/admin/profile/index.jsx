import React, {useEffect, useState} from 'react';
import {Avatar, Button, Col, Divider, Form, Input, message, Modal, Row, Select, Spin, Upload} from 'antd';
import {DeleteOutlined, LogoutOutlined, UploadOutlined} from '@ant-design/icons';
import {useChangePasswordMutation, useGetUserQuery, useLogOutMutation, useUpdateUserMutation} from '../../../features/user/user';
import {Bounce, ToastContainer} from 'react-toastify';
import ToastNotification from '../../../components/ToastNotification/ToastNotification';
import {useDispatch} from 'react-redux';
import {handleLogout} from '../logoutUtils';
import {useNavigate} from 'react-router-dom';
import {Icon} from '@iconify/react';

const {Option} = Select;

const Profile = () => {
	const {
		data: InfoUser = [],
		error,
		isLoading: userIsLoading,
	} = useGetUserQuery();
	
	const [formChangePassword] = Form.useForm();
	const [isModalVisibleLogOut, setIsModalVisibleLogOut] = useState(false);
	const [isModalVisible, setIsModalVisible] = useState(false);
	const [form] = Form.useForm();
	const [imageUrl, setImageUrl] = useState('');
	const [fileList, setFileList] = useState([]);
	const dispatch = useDispatch();
	const [submitLogOut, {isLoading: isLoadingLogOut}] = useLogOutMutation();
	const navigate = useNavigate();
	
	const genderDisplay = (gender) => {
		const genderMap = {
			nam: 'Nam',
			nu: 'Nữ',
			khac: 'Khác',
			undefined: 'Chưa thiết lập',
		};
		return genderMap[gender] || 'Khác';
	};
	
	// Hàm xử lý hiển thị vai trò
	const roleDisplay = (role) => {
		const roleMap = {
			admin: 'Quản trị viên',
			editor: 'Biên tập viên',
			undefined: 'Chưa thiết lập',
		};
		return roleMap[role] || 'Biên tập viên';
	};
	
	useEffect(() => {
		const apiData = {
			email: InfoUser?.user?.email || 'Chưa thiết lập',
			first_name: InfoUser?.user?.first_name || 'Chưa thiết lập',
			last_name: InfoUser?.user?.last_name || 'Chưa thiết lập',
			profile_image: InfoUser?.user?.profile_image || '',
			gender: InfoUser?.user?.gender || 'Chưa thiết lập',
			is_active: InfoUser?.user?.is_active || false,
			role: InfoUser?.user?.role || 'Chưa thiết lập',
		};
		form.setFieldsValue(apiData);
		if (apiData.profile_image) {
			setImageUrl(apiData.profile_image);
		}
	}, [form, InfoUser]);
	
	const showModal = () => {
		setIsModalVisible(true);
		formChangePassword.resetFields();
	};
	
	const showModalLogOut = () => {
		setIsModalVisibleLogOut(true);
	};
	
	const handleCancel = () => {
		setIsModalVisible(false);
		formChangePassword.resetFields();
	};
	
	const [changePassword, {isLoading: isLoadingChangePassword}] = useChangePasswordMutation();
	const handleSubmitChangePassword = async (values) => {
		try {
			if (values && values.new_password !== values.confirm_password) {
				ToastNotification({
					type: 'warning',
					title: 'Cảnh báo đổi mật khẩu không thành công',
					message: `Mật khẩu xác nhận không khớp với mật khẩu mới!`,
				});
			}
			const response = await changePassword(values).unwrap();
			if (response) {
				ToastNotification({
					type: 'success',
					title: 'Thay đổi mật khẩu thành công !',
					message: `Thay đổi mật khẩu thành công!`,
				});
				setIsModalVisible(false);
				formChangePassword.resetFields();
			}
		} catch (error) {
			ToastNotification({
					type: 'error',
					title: 'Thay đổi mật khẩu không thành công !',
					message: error?.message || 'Vui lòng kiểm tra lại.',
				},
			);
		}
	};
	
	const handleUploadChange = ({file}) => {
		console.log('Upload event:', file);
		if (file.status === 'removed') {
			setImageUrl('');
			form.setFieldsValue({profile_image: ''});
			return;
		}
		const fileObj = file.originFileObj || file;
		if (fileObj instanceof File) {
			const reader = new FileReader();
			reader.onload = (e) => {
				setImageUrl(e.target.result);
				form.setFieldsValue({profile_image: fileObj});
			};
			reader.onerror = (e) => {
				console.error('FileReader error:', e);
				message.error('Failed to read the image file');
			};
			reader.readAsDataURL(fileObj);
		} else {
			console.warn('No valid file object:', file);
			message.error('Invalid file selected');
		}
	};
	
	const [submitContact, {isLoading}] = useUpdateUserMutation();
	const handleSubmit = async (values) => {
		try {
			const response = await submitContact(values).unwrap();
			if (response) {
				ToastNotification({
					type: 'success',
					title: 'Cập nhật thành công !',
					message: `Cập nhật thông tin người dùng thành công!`,
				});
				setImageUrl(response?.user?.profile_image);
				setFileList([]);
			}
		} catch (error) {
			ToastNotification({
				type: 'error',
				title: 'Cập nhật không thành công !',
				message: error?.message || 'Vui lòng kiểm tra lại.',
			});
		}
	};
	
	const beforeUpload = (file) => {
		const isImage = file.type.startsWith('image/');
		if (!isImage) {
			message.error('Chỉ được tải lên file ảnh!');
			return Upload.LIST_IGNORE;
		}
		const isLt2M = file.size / 1024 / 1024 < 2;
		if (!isLt2M) {
			message.error('Ảnh phải nhỏ hơn 2MB!');
			return Upload.LIST_IGNORE;
		}
		return true;
	};
	
	return (
		<>
			<ToastContainer
				position="top-right"
				autoClose={5000}
				hideProgressBar={false}
				newestOnTop={false}
				closeOnClick={false}
				rtl={false}
				pauseOnFocusLoss
				draggable
				pauseOnHover
				theme="light"
				transition={Bounce}
				className="custom-toast-container"
			/>
			{isLoading && (
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
            Đang cập nhật thông tin...
          </span>
				</div>
			)}
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
			<div className="mx-auto mt-3 overflow-hidden rounded-xl bg-white shadow-lg">
				{/* Cover */}
				<div className="relative h-48 bg-gray-200">
					<img
						src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1280&q=80"
						alt="cover"
						className="h-full w-full object-cover"
					/>
					<div className="absolute -bottom-10 left-8">
						{
							InfoUser?.user?.profile_image ? (<Avatar
								size={100}
								src={InfoUser?.user?.profile_image}
								className="ring-4 ring-white"
							/>) : (
								<Avatar
									style={{
										backgroundColor: `#${Math.floor(Math.random() * 16777215).toString(16)}`,
										verticalAlign: 'middle',
									}}
									size={100}
								>
									{InfoUser?.user?.last_name?.split(' ').pop()?.charAt(0)?.toUpperCase()}
								</Avatar>)
						}
					</div>
				</div>
				
				{/* Content */}
				<div className="flex flex-col gap-20 px-6 pb-6 pt-12 md:flex-row">
					{/* Left - Info */}
					<div className="md:w-1/2">
						<h3 className="mb-1 text-xl font-semibold text-[#999999]">
							@{InfoUser?.user?.username || 'Chưa thiết lập'}
						</h3>
						<h2 className="mb-1 text-2xl font-semibold text-[#333333] flex items-center gap-2">
							{InfoUser?.user?.first_name + ' ' + InfoUser?.user?.last_name}
							{
								InfoUser?.user?.role === 'admin' ? (
									<Icon icon="mdi:tick-decagram" width="20" height="20" style={{color: '#0f00d0'}}/>
								) : (
									<Icon icon="mdi:tick-decagram" width="20" height="20" style={{color: '#02d000'}}/>
								)
							}
						</h2>
						<div className="mb-4 flex items-center justify-start gap-4">
							<h3 className="w-max rounded-[30px] border border-brand-800 px-2 text-center text-sm text-brand-800">
								Role: {InfoUser?.user?.role}
							</h3>
							<div className="w-max rounded-[30px] text-sm border border-green-800 px-2 text-center text-green-800">
								Status:
								{InfoUser?.user?.is_active
									? ' Active'
									: ' Inactive'}
							</div>
						</div>
						<Divider/>
						<div className="space-y-3 text-base bg-white  max-w-full mx-auto mt-10">
							{/* Email */}
							<div className="flex items-center space-x-3 p-3 rounded-md hover:bg-gray-200 transition-colors">
								<Icon icon="mdi:email-outline" className="w-6 h-6 text-blue-500"/>
								<div className="flex justify-between w-full">
									<span className="font-medium text-gray-700">Email:</span>
									<span className="font-bold text-gray-900">
            {InfoUser?.user?.email || 'Chưa thiết lập'}
          </span>
								</div>
							</div>
							
							{/* Giới tính */}
							<div className="flex items-center space-x-3 p-3 rounded-md hover:bg-gray-200 transition-colors">
								<Icon icon="mdi:account" className="w-6 h-6 text-purple-500"/>
								<div className="flex justify-between w-full">
									<span className="font-medium text-gray-700">Giới tính:</span>
									<span className="font-bold text-gray-900">
            {genderDisplay(InfoUser?.user?.gender)}
          </span>
								</div>
							</div>
							
							{/* Vai trò */}
							<div className="flex items-center space-x-3 p-3 rounded-md hover:bg-gray-200 transition-colors">
								<Icon icon="mdi:shield-account" className="w-6 h-6 text-orange-500"/>
								<div className="flex justify-between w-full">
									<span className="font-medium text-gray-700">Vai trò:</span>
									<span className="font-bold text-gray-900">
            {roleDisplay(InfoUser?.user?.role)}
          </span>
								</div>
							</div>
							
							{/* Kích hoạt */}
							<div className="flex items-center space-x-3 p-3 rounded-md hover:bg-gray-200 transition-colors">
								<Icon icon="mdi:check-circle-outline" className="w-6 h-6 text-lime-500"/>
								<div className="flex justify-between w-full">
									<span className="font-medium text-gray-700">Kích hoạt:</span>
									<span className="font-bold text-lime-500">
            {InfoUser?.user?.is_active ? 'Đang kích hoạt' : 'Chưa kích hoạt'}
          </span>
								</div>
							</div>
						</div>
					</div>
					
					{/* Right - Form */}
					<div className="md:w-1/2">
						<Form form={form} layout="vertical" onFinish={handleSubmit}>
							<Row gutter={16}>
								<Col xs={24} md={12}>
									<Form.Item
										name="first_name"
										label="Họ"
										rules={[
											{required: true, message: 'Vui lòng nhập họ!'},
											{
												pattern:
													/^[a-zA-Z\sàáãạảăắằẳẵặâấầẩẫậèéẹẻẽêềếểễệđìíĩỉịòóõọỏôốồổỗộơớởỡợùúũụủưứừửữựỳýỷỹỵ]+$/,
												message: 'Họ chỉ được chứa chữ cái và dấu tiếng Việt!',
											},
										]}
									>
										<Input size="large" placeholder="Nhập họ"/>
									</Form.Item>
								</Col>
								<Col xs={24} md={12}>
									<Form.Item
										name="last_name"
										label="Tên"
										rules={[
											{required: true, message: 'Vui lòng nhập tên!'},
											{
												pattern:
													/^[a-zA-Z\sàáãạảăắằẳẵặâấầẩẫậèéẹẻẽêềếểễệđìíĩỉịòóõọỏôốồổỗộơớởỡợùúũụủưứừửữựỳýỷỹỵ]+$/,
												message: 'Tên chỉ được chứa chữ cái và dấu tiếng Việt!',
											},
										]}
									>
										<Input size="large" placeholder="Nhập tên"/>
									</Form.Item>
								</Col>
							</Row>
							
							{/* Email + Upload Image Row */}
							<Row gutter={16}>
								<Col xs={24} md={12}>
									<Form.Item
										name="email"
										label="Email (không thể sửa đổi)"
										rules={[
											{required: true, message: 'Vui lòng nhập email!'},
											{type: 'email', message: 'Email không hợp lệ!'},
										]}
									>
										<Input disabled size="large" placeholder="Nhập email"/>
									</Form.Item>
								</Col>
								<Col xs={24} md={12}>
									<Form.Item
										name="gender"
										label="Giới tính"
										rules={[
											{required: true, message: 'Vui lòng chọn giới tính!'},
										]}
									>
										<Select size="large" placeholder="Chọn giới tính">
											<Option value="nam">Nam</Option>
											<Option value="nu">Nữ</Option>
											<Option value="khac">Khác</Option>
										</Select>
									</Form.Item>
								</Col>
							</Row>
							{/* Gender + Role Row */}
							<Row gutter={16}>
								<Col xs={24} md={12}>
									<Form.Item
										label="Tải ảnh lên"
										name="profile_image"
										valuePropName="fileList"
										getValueFromEvent={(e) => {
											if (Array.isArray(e)) {
												return e;
											}
											return e && e.fileList;
										}}
									>
										<Upload
											size="large"
											accept="image/*"
											fileList={fileList}
											beforeUpload={beforeUpload}
											onChange={(info) => {
												setFileList(info.fileList);
												handleUploadChange(info);
											}}
											showUploadList={false}
										>
											<Button
												size="large"
												icon={<UploadOutlined/>}
												variant="dashed"
											>
												Chọn ảnh
											</Button>
										</Upload>
										{imageUrl && (
											<div
												className="mt-5 flex items-center gap-2"
												style={{
													minWidth: 128,
													minHeight: 128,
													width: 128,
													height: 128,
													position: 'relative',
													background: '#f3f4f6',
													borderRadius: '0.5rem',
													border: '1px solid #e5e7eb',
													justifyContent: 'center',
													alignItems: 'center',
													display: 'flex',
												}}
											>
												<img
													src={imageUrl}
													alt="Preview"
													style={{
														width: '100%',
														height: '100%',
														objectFit: 'cover',
														objectPosition: 'center',
													}}
												/>
												<Button
													size="large"
													type="link"
													danger
													onClick={() => {
														setImageUrl('');
														setFileList([]);
														form.setFieldsValue({profile_image: ''});
													}}
													style={{
														position: 'absolute',
														top: -15,
														right: -15,
														fontWeight: 'bold',
														padding: 2,
														background: '#DDDDDD',
														borderRadius: '50%',
														width: 30,
														height: 30,
													}}
												>
													<DeleteOutlined style={{fontSize: 20}}/>
												</Button>
											</div>
										)}
									</Form.Item>
								</Col>
							</Row>
							{/* Submit */}
							<Form.Item>
								<Button
									loading={isLoading}
									size="large"
									type="primary"
									htmlType="submit"
									className="mt-5"
								>
									{isLoading ? 'Đang cập nhật...' : 'Cập nhật thông tin'}
								</Button>
								<Button
									size="large"
									onClick={showModal}
									color="default"
									variant="dashed"
									className="mt-5 ml-4"
								>
									Đổi mật khẩu
								</Button>
								<Button
									icon={<LogoutOutlined style={{color: 'red'}}/>}
									size="large"
									onClick={showModalLogOut}
									color="default"
									variant="filled"
									className="mt-5 ml-4"
								>
									<span style={{color: 'red'}}>Đăng xuất</span>
								</Button>
							</Form.Item>
						</Form>
					</div>
				</div>
			</div>
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
							onClick={async () => {
								try {
									await submitLogOut({
										id: InfoUser?.user?.id,
									}).unwrap();
									await handleLogout(dispatch);
								} catch (error) {
									console.error('Error during logout:', error);
								} finally {
									setIsModalVisibleLogOut(false);
								}
							}}
						>
							{isLoadingLogOut ? 'Đang xử lý đăng xuất...' : 'Đăng xuất ngay'}
						</Button>
					</div>
				</div>
			</Modal>
			<Modal
				title="Đổi mật khẩu"
				open={isModalVisible}
				onCancel={handleCancel}
				footer={null}
				centered
			>
				<Form
					form={formChangePassword}
					layout="vertical"
					onFinish={handleSubmitChangePassword}
				>
					<Form.Item
						name="old_password"
						label="Mật khẩu hiện tại"
						rules={[
							{required: true, message: 'Vui lòng nhập mật khẩu hiện tại!'},
						]}
					>
						<Input.Password size="large" placeholder="Nhập mật khẩu hiện tại"/>
					</Form.Item>
					<Form.Item
						name="new_password"
						label="Mật khẩu mới"
						rules={[
							{required: true, message: 'Vui lòng nhập mật khẩu mới!'},
							{min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự!'},
							{
								pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{6,}$/,
								message: 'Mật khẩu phải có ít nhất 1 chữ hoa, 1 chữ thường, 1 số, 1 ký tự đặc biệt!',
							},
						]}
					>
						<Input.Password size="large" placeholder="Nhập mật khẩu mới"/>
					</Form.Item>
					<Form.Item
						name="confirm_password"
						label="Xác nhận mật khẩu mới"
						dependencies={['new_password']}
						rules={[
							{required: true, message: 'Vui lòng xác nhận mật khẩu mới!'},
							({getFieldValue}) => ({
								validator(_, value) {
									if (!value || getFieldValue('new_password') === value) {
										return Promise.resolve();
									}
									return Promise.reject(new Error('Mật khẩu xác nhận không khớp!'));
								},
							}),
						]}
					>
						<Input.Password size="large" placeholder="Xác nhận mật khẩu mới"/>
					</Form.Item>
					<Form.Item>
						<div className="flex justify-end gap-2">
							<Button size="large" onClick={handleCancel}>
								Hủy đổi mật khẩu
							</Button>
							<Button
								size="large"
								type="primary"
								htmlType="submit"
								loading={isLoadingChangePassword}
							>
								{isLoadingChangePassword ? 'Đang xử lý đổi mật khẩu...' : 'Đổi mật khẩu'}
							</Button>
						</div>
					</Form.Item>
					{(isLoadingChangePassword) && (
						<div
							style={{
								position: 'absolute',
								zIndex: 10,
								top: 0,
								left: 0,
								width: '100%',
								height: '100%',
								background: 'rgba(255,255,255,0.7)',
								display: 'flex',
								flexDirection: 'column',
								alignItems: 'center',
								justifyContent: 'center',
								borderRadius: 8,
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
                              Đang xử lý thay đổi mật khẩu, vui lòng đợi...
                            </span>
						</div>
					)}
				</Form>
			</Modal>
		</>
	);
};

export default Profile;
