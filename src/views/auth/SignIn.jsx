import {Button, Form, Input, Spin} from 'antd';
import React from 'react';
import Auth_Img from 'assets/img/auth/dashboard.png';
import {useSigninMutation} from 'features/auth/signIn.js';
import {Bounce, toast, ToastContainer} from 'react-toastify';
import {useNavigate} from 'react-router-dom';

const SignIn = () => {
	const [form] = Form.useForm();
	const navigate = useNavigate();
	const [submit, {isLoading, isFetching}] = useSigninMutation();
	
	const onFinish = async (values) => {
		try {
			const response = await submit({
				email: values.email,
				password: values.password,
			}).unwrap();
			if (response?.user && response?.tokens) {
				navigate('/admin/dashboard', {
					replace: true,
				});
			}
			form.resetFields();
		} catch (error) {
			toast.error(
				<div className="flex w-full flex-col items-start justify-start gap-1">
					<div className="text-base font-semibold">
						{'Đăng nhập không thành công !'}
					</div>
					<div className="text-sm text-gray-500">
						{error?.message || 'Vui lòng kiểm tra lại thông tin đăng nhập.'}
					</div>
				</div>,
				{
					position: 'top-right',
					autoClose: 5000,
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
	
	return (
		<>
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
            Đang xử lý, vui lòng đợi trong giây lát...
          </span>
				</div>
			)}
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
			<div className="grid h-full w-full grid-cols-[70%,30%] items-center bg-[#EAEAEA]">
				<div className="flex h-full w-full flex-col items-center justify-center gap-20">
					<img
						src={Auth_Img}
						alt="Login"
						className="hidden h-[50vh] w-full max-w-[600px] object-cover md:block"
					/>
					<h3 className="text-4xl font-bold text-brand-600" style={{fontFamily: 'Pacifico, cursive'}}>
						HỆ THỐNG QUẢN LÝ - LANDING PAGE
					</h3>
				</div>
				<div className="mr-5 flex h-full w-full flex-col items-center justify-center bg-white p-4 shadow-2xl dark:bg-navy-900">
					<div className="mx-auto w-full max-w-[420px]">
						<h4 className="text-black mb-4 text-4xl font-bold">
							Đăng nhập hệ thống
						</h4>
						<p className="mb-14 ml-1 text-base text-gray-600">
							Vui lòng đăng nhập để tiếp tục sử dụng hệ thống quản lý.
						</p>
						<Form
							form={form}
							name="login"
							layout="vertical"
							onFinish={onFinish}
						>
							<Form.Item
								name="email"
								label="Email"
								className="mb-8"
								initialValue={'test@gmail.com'}
								rules={[
									{required: true, message: 'Vui lòng nhập email!'},
									{type: 'email', message: 'Email không đúng định dạng!'},
								]}
							>
								<Input
									placeholder="Nhập email của bạn !"
									size="large"
									type="email"
								/>
							</Form.Item>
							<Form.Item
								name="password"
								label="Password"
								style={{marginBottom: 50}}
								initialValue={'Password'}
								rules={[
									{required: true, message: 'Vui lòng nhập mật khẩu!'},
									{min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự!'},
									{
										pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{6,}$/,
										message: 'Mật khẩu phải có ít nhất 1 chữ hoa, 1 chữ thường, 1 số, 1 ký tự đặc biệt!',
									},
								]}
							>
								<Input.Password
									type="password"
									placeholder="Nhập Password của bạn !"
									size="large"
								/>
							</Form.Item>
							<Form.Item>
								<Button
									loading={isLoading || isFetching}
									type="primary"
									htmlType="submit"
									size="large"
									style={{width: '100%', height: '50px', fontSize: '18px'}}
									className="bg-brand-500 hover:bg-brand-600"
								>
									{isLoading || isFetching ? 'Đang đăng nhập...' : 'Đăng nhập'}
								</Button>
							</Form.Item>
						</Form>
						<div className="flex justify-between mt-2 gap-3">
							<Button
								size="large"
								type="dashed"
								onClick={() => {
									form.setFieldsValue({password: 'Pass@123456'});
								}}
							>
								Dùng password mặc định
							</Button>
							<Button
								size="large"
								type="dashed"
								onClick={() => {
									form.setFieldsValue({
										email: 'admin@gmail.com',
										password: 'Admin@123456',
									});
								}}
							>
								Dùng tài khoản admin
							</Button>
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

export default SignIn;
