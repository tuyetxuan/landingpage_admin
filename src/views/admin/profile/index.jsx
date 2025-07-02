import React, {useEffect, useState} from 'react';
import {Avatar, Button, Col, Divider, Form, Input, message, Modal, Row, Select, Spin, Upload} from 'antd';
import {DeleteOutlined, UploadOutlined} from '@ant-design/icons';
import {useChangePasswordMutation, useGetUserQuery, useUpdateUserMutation} from '../../../features/user/user';
import {Bounce, toast, ToastContainer} from 'react-toastify';
import ToastNotification from "../../../components/ToastNotification/ToastNotification";

const {Option} = Select;

const Profile = () => {
	const {
		data: InfoUser = [],
		error,
		isLoading: userIsLoading,
	} = useGetUserQuery();
	const [formChangePassword] = Form.useForm();
	const [isModalVisible, setIsModalVisible] = useState(false);
	const [form] = Form.useForm();
	// const [changePassword, {isLoading}] = useChangePasswordMutation();
	const [imageUrl, setImageUrl] = useState('');
	const [fileList, setFileList] = useState([]);
	
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
				}
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
				toast.success('Cập nhật thành công !', {
					position: 'top-right',
					autoClose: 1000,
					hideProgressBar: false,
					closeOnClick: false,
					pauseOnHover: true,
					draggable: true,
					progress: undefined,
					theme: 'light',
					transition: Bounce,
				});
				setImageUrl(response?.user?.profile_image);
				setFileList([]);
			}
		} catch (error) {
			toast.error(
				<div className="flex w-full flex-col items-start justify-start gap-1">
					<div className="text-base font-semibold">
						{'Cập nhật không thành công !'}
					</div>
					<div className="text-sm text-gray-500">
						{error?.message || 'Vui lòng kiểm tra lại.'}
					</div>
				</div>,
				{
					position: 'top-right',
					autoClose: 1000,
					hideProgressBar: false,
					closeOnClick: false,
					pauseOnHover: true,
					draggable: true,
					progress: undefined,
					theme: 'light',
					transition: Bounce,
				},
			);
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
			<div className="mx-auto mt-3 overflow-hidden rounded-xl bg-white shadow-lg">
				{/* Cover */}
				<div className="relative h-48 bg-gray-200">
					<img
						src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1280&q=80"
						alt="cover"
						className="h-full w-full object-cover"
					/>
					<div className="absolute -bottom-10 left-8">
						<Avatar
							size={100}
							src={
								InfoUser?.user?.profile_image || 'https://placehold.co/600x400'
							}
							className="ring-4 ring-white"
						/>
					</div>
				</div>
				
				{/* Content */}
				<div className="flex flex-col gap-20 px-6 pb-6 pt-12 md:flex-row">
					{/* Left - Info */}
					<div className="md:w-1/2">
						<h3 className="mb-1 text-xl font-semibold text-[#999999]">
							#ID: {InfoUser?.user?.username || 'Chưa thiết lập'}
						</h3>
						<h2 className="mb-1 text-2xl font-semibold">
							{InfoUser?.user?.first_name + ' ' + InfoUser?.user?.last_name}
						</h2>
						<div className="mb-4 flex items-center justify-start gap-4">
							<h3 className="mb-1 w-max rounded-[30px] bg-brand-200 px-3 text-center text-xl text-brand-800">
								{InfoUser?.user?.role}
							</h3>
							<div className="w-max rounded-[30px] bg-green-200 px-3 text-center text-green-800">
                <span className="text-lg font-bold">
                  Trạng thái:
	                {InfoUser?.user?.is_active
		                ? ' Hoạt động'
		                : ' Không hoạt động'}
                </span>
							</div>
						</div>
						<Divider/>
						<div className="space-y-4 text-base">
							<div className="flex justify-between">
								<span className="font-medium">Email:</span>
								<span className="font-bold">
                  {InfoUser?.user?.email || 'Chưa thiết lập'}
                </span>
							</div>
							<div className="flex justify-between">
								<span className="font-medium">Giới tính:</span>
								<span className="font-bold">
                  {InfoUser?.user?.gender === 'nam' ? 'Nam' : InfoUser?.user?.gender === 'nu' ? 'Nữ' : 'Khác' || 'Chưa thiết lập'}
                </span>
							</div>
							<div className="flex justify-between">
								<span className="font-medium">Vai trò:</span>
								<span className="font-bold">
                  {InfoUser?.user?.role === 'admin' ? 'Quản trị viên' : 'Biên tập viên' || 'Chưa thiết lập'}
                </span>
							</div>
							<div className="flex justify-between">
								<span className="font-medium">Kích hoạt:</span>
								<span className="font-bold">
                  {InfoUser?.user?.is_active ? 'Đã kích hoạt' : 'Chưa kích hoạt'}
                </span>
							</div>
						</div>
					</div>
					
					{/* Right - Form */}
					<div className="md:w-1/2">
						<Form form={form} layout="vertical" onFinish={handleSubmit}>
							{/* First Name + Last Name Row */}
							<Row gutter={16}>
								<Col xs={24} md={12}>
									<Form.Item
										name="first_name"
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
								<Col xs={24} md={12}>
									<Form.Item
										name="last_name"
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
							</Row>
							
							{/* Email + Upload Image Row */}
							<Row gutter={16}>
								<Col xs={24} md={12}>
									<Form.Item
										name="email"
										label="Email"
										rules={[
											{required: true, message: 'Vui lòng nhập email!'},
											{type: 'email', message: 'Email không hợp lệ!'},
										]}
									>
										<Input size="large" placeholder="Nhập email"/>
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
							</Form.Item>
						</Form>
					</div>
				</div>
			</div>
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
