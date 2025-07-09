import React, {useEffect, useState} from 'react';
import {Button, Col, Form, Input, message, Modal, Popconfirm, Row, Select, Space, Spin, Switch, Table, Upload} from 'antd';
import {DeleteOutlined, EditOutlined, PlusOutlined, SearchOutlined, UploadOutlined} from '@ant-design/icons';
import {createStyles} from 'antd-style';
import {Bounce, ToastContainer} from 'react-toastify';
import {useCreateServiceMutation, useDeleteServiceMutation, useGetServiceQuery, useUpdateServiceMutation} from '../../../features/service/service';
import ToastNotification from '../../../components/ToastNotification/ToastNotification';
import {useGetCategoriesQuery} from '../../../features/categoryService/categoryService';
import 'react-toastify/dist/ReactToastify.css';

const {Option} = Select;

const useStyle = createStyles(({css}) => ({
	customTable: css`
        .ant-table {
            .ant-table-container {
                .ant-table-body,
                .ant-table-content {
                    scrollbar-width: thin !important;
                    scrollbar-color: #939393 transparent !important;
                    scrollbar-gutter: stable !important;
                }
            }
        }
	`,
}));

const Services = () => {
	const {styles} = useStyle();
	const {
		data: categories = [],
		error: categoriesError,
		isLoading: categoriesIsLoading,
		refetch: refetchCategories,
	} = useGetCategoriesQuery();
	const {
		data: services = [],
		error: serviceError,
		isLoading: serviceIsLoading,
		refetch: refetchServices,
	} = useGetServiceQuery();
	
	const [isAddModalVisible, setIsAddModalVisible] = useState(false);
	const [isEditModalVisible, setIsEditModalVisible] = useState(false);
	const [currentRecord, setCurrentRecord] = useState(null);
	const [form] = Form.useForm();
	const [imageUrl, setImageUrl] = useState(null);
	
	useEffect(() => {
		if (isAddModalVisible) {
			setImageUrl('');
			form.resetFields();
		} else if (isEditModalVisible && currentRecord) {
			setImageUrl(currentRecord.image_url);
			form.setFieldsValue({
				...currentRecord,
				category_id: currentRecord?.category?.id || undefined,
			});
		}
	}, [isAddModalVisible, isEditModalVisible, currentRecord, form]);
	
	const handleAdd = () => {
		setCurrentRecord(null);
		setIsAddModalVisible(true);
		setImageUrl(null);
		form.resetFields();
	};
	
	const handleEdit = (id) => {
		const record = services.find((item) => item.id === id);
		if (record) {
			setCurrentRecord(record);
			setIsEditModalVisible(true);
		}
	};
	
	const handleDelete = async (id) => {
		try {
			const response = await submitDeleteService(id).unwrap();
			if (response) {
				refetchServices();
				ToastNotification({
					type: 'success',
					title: 'Xóa dịch vụ thành công!',
					message: `Xóa dịch vụ thành công, ID: ${response?.service?.id}.`,
				});
			}
		} catch (error) {
			ToastNotification({
				type: 'error',
				title: 'Xóa dịch vụ không thành công!',
				message: `Xóa dịch vụ không thành công, vui lòng thử lại sau. CODE: ${error.message}`,
			});
		}
	};
	
	const handleSearch = (e) => {
		setSearchText(e.target.value);
	};
	
	const handleFilterStatus = (value) => {
		setFilterStatus(value);
	};
	
	const handleUploadChange = ({file}) => {
		if (file.status === 'removed') {
			setImageUrl(null);
			form.setFieldsValue({image_url: null});
			return;
		}
		const fileObj = file.originFileObj || file;
		if (fileObj instanceof File) {
			const reader = new FileReader();
			reader.onload = (e) => {
				setImageUrl(e.target.result);
				form.setFieldsValue({image_url: fileObj});
			};
			reader.onerror = (e) => {
				message.error('Failed to read the image file');
			};
			reader.readAsDataURL(fileObj);
		} else {
			message.error('Invalid file selected');
		}
	};
	
	const [submitService, {isLoading}] = useCreateServiceMutation();
	const [submitUpdateService, {isLoading: isLoadingUpdateService}] = useUpdateServiceMutation();
	const [submitDeleteService, {isLoading: isLoadingDeleteService}] = useDeleteServiceMutation();
	
	const handleSubmit = async () => {
		form
			.validateFields()
			.then(async (values) => {
				if (!imageUrl) {
					ToastNotification({
						type: 'warn',
						title: 'Vui lòng tải lên hình ảnh!',
						message: 'Hình ảnh là bắt buộc để tạo hoặc cập nhật dịch vụ.',
					});
					return;
				}
				const payload = {
					...values,
					is_active: values.is_active ? values.is_active : true,
				};
				
				if (currentRecord) {
					const response = await submitUpdateService({
						...payload,
						service_id: currentRecord.id,
					}).unwrap();
					if (response) {
						refetchServices();
						ToastNotification({
							type: 'success',
							title: 'Cập nhật dịch vụ thành công!',
							message: `Cập nhật dịch vụ, ID: ${response?.service?.id} thành công.`,
						});
					}
				} else {
					const response = await submitService(payload).unwrap();
					if (response) {
						refetchServices();
						ToastNotification({
							type: 'success',
							title: 'Tạo dịch vụ thành công!',
							message: `Tạo dịch vụ thành công, ID: ${response?.service?.id}.`,
						});
					}
				}
				setIsAddModalVisible(false);
				setIsEditModalVisible(false);
			})
			.catch((error) => {
				let field = 'Vui lòng kiểm tra lại dữ liệu đầu vào.';
				if (error && error.errorFields && Array.isArray(error.errorFields) && error.errorFields.length > 0) {
					field = error.errorFields[0]?.errors?.[0] || field;
				} else if (error && error.message) {
					field = error.message;
				}
				ToastNotification({
					type: 'error',
					title: 'Thông báo lỗi - Error!',
					message: field,
				});
			});
	};
	
	const [searchText, setSearchText] = useState('');
	const [filterStatus, setFilterStatus] = useState('all');
	
	const filteredData = services.filter((item) => {
		const matchesSearch =
			item.name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').includes(
				searchText.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, ''),
			) ||
			(item.description || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').includes(
				searchText.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, ''),
			);
		const matchesStatus =
			filterStatus === 'all'
				? true
				: filterStatus === 'active'
					? item.is_active
					: !item.is_active;
		return matchesSearch && matchesStatus;
	});
	
	const columns = [
		{
			title: 'Image',
			dataIndex: 'image_url',
			key: 'image_url',
			align: 'center',
			width: 130,
			render: (text) => (
				<img
					src={text}
					alt="service image"
					style={{
						width: 40,
						height: 40,
						objectFit: 'cover',
						borderRadius: 4,
						margin: '0 auto',
					}}
				/>
			),
		},
		{
			title: 'Code',
			dataIndex: 'code',
			key: 'code',
			width: 150,
			render: (text) => <span style={{fontWeight: 'bold', color: '#1a1a1a'}}>{text}</span>,
		},
		{
			title: 'Name',
			dataIndex: 'name',
			key: 'name',
			width: 240,
			render: (text) => {
				const words = text.split(/\s+/);
				if (words.length > 10) {
					return <span style={{fontWeight: 'bold', color: '#1a1a1a'}}>{words.slice(0, 10).join(' ')} ...</span>;
				}
				return <span style={{fontWeight: 'bold', color: '#1a1a1a'}}>{text}</span>;
			},
		},
		{
			title: 'Description',
			dataIndex: 'description',
			key: 'description',
			render: (text) => {
				if (!text) return <span>-</span>;
				return text.length > 50 ? `${text.slice(0, 50)} ...` : text;
			},
		},
		{
			title: 'Category',
			dataIndex: 'category',
			key: 'category',
			width: 150,
			render: (category) => <span>{category?.name || '-'}</span>,
		},
		{
			title: 'Link Page',
			dataIndex: 'link_page',
			key: 'link_page',
			width: 200,
			render: (text) => (
				<a href={text} target="_blank" rel="noopener noreferrer">
					{text || '-'}
				</a>
			),
		},
		{
			title: 'Status',
			dataIndex: 'is_active',
			key: 'is_active',
			align: 'center',
			width: 120,
			render: (text) => (
				<span style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%'}}>
          {text === true ? (
	          <span style={{color: '#00d029'}}>Active</span>
          ) : (
	          <span style={{color: '#d00001'}}>Inactive</span>
          )}
        </span>
			),
		},
		{
			title: 'Created At',
			dataIndex: 'created_at',
			key: 'created_at',
			align: 'center',
			width: 180,
			render: (text) => {
				const date = new Date(text);
				const day = String(date.getDate()).padStart(2, '0');
				const month = String(date.getMonth() + 1).padStart(2, '0');
				const year = date.getFullYear();
				const weekday = date.toLocaleDateString('vi-VN', {weekday: 'short'});
				return `${weekday}, ${day}/${month}/${year}`;
			},
		},
		{
			title: 'Action',
			key: 'action',
			fixed: 'right',
			width: 120,
			align: 'center',
			render: (_, record) => (
				<Space size="middle">
					<Button type="link" icon={<EditOutlined/>} onClick={() => handleEdit(record.id)}/>
					<Popconfirm
						title="Bạn có chắc chắn muốn xóa dịch vụ này?"
						onConfirm={() => handleDelete(record.id)}
						okText={isLoadingDeleteService ? 'Đang xử lý ...' : 'Có, Hãy xóa'}
						cancelText="Không"
						placement="left"
					>
						<Button type="link" danger icon={<DeleteOutlined/>}/>
					</Popconfirm>
				</Space>
			),
		},
	];
	
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
			<Modal
				title={currentRecord ? 'Update Service' : 'Add Service'}
				open={isAddModalVisible || isEditModalVisible}
				onCancel={() => {
					setIsAddModalVisible(false);
					setIsEditModalVisible(false);
					setImageUrl('');
					form.resetFields();
				}}
				onOk={handleSubmit}
				okText={isLoading || isLoadingUpdateService ? 'Đang xử lý ...' : currentRecord ? 'Update' : 'Create'}
				centered
				width="80vw"
				style={{maxHeight: '96vh', overflow: 'auto'}}
				bodyStyle={{maxHeight: '80vh', overflow: 'auto', padding: 6}}
				maskClosable={false}
				closable={true}
				keyboard={false}
			>
				<Form layout="vertical" form={form} style={{flex: 1, display: 'flex', flexDirection: 'column'}}>
					<Row gutter={16} style={{margin: 0}}>
						<Col span={12} style={{paddingRight: 8, paddingLeft: 0}}>
							<Form.Item
								name="code"
								label="Code"
								rules={[{required: true, message: 'Please input Service Code!'}]}
							>
								<Input size="large" placeholder="Enter service code"/>
							</Form.Item>
						</Col>
						<Col span={12} style={{paddingRight: 0, paddingLeft: 8}}>
							<Form.Item
								name="name"
								label="Name"
								rules={[{required: true, message: 'Please input Service Name!'}]}
							>
								<Input size="large" placeholder="Enter service name"/>
							</Form.Item>
						</Col>
					</Row>
					<Row gutter={16} style={{margin: 0}}>
						<Col span={12} style={{paddingRight: 8, paddingLeft: 0}}>
							<Form.Item
								name="category_id"
								label="Category"
								initialValue={currentRecord ? currentRecord.category_id : undefined}
								rules={[{required: true, message: 'Please select a Category!'}]}
							>
								<div style={{display: 'flex', alignItems: 'center'}}>
									<Select size="large" placeholder="Select a category" style={{flex: 1}}>
										{categories.map((category) => (
											<Option key={category.id} value={category.id}>
												{category.name}
											</Option>
										))}
									</Select>
									<Button
										size="large"
										style={{marginLeft: 8}}
										type="dashed"
										icon={<PlusOutlined/>}
										onClick={() => {
											message.info('Quick add category clicked!');
										}}
									>
										<span style={{fontSize: 16}}>Quick Add</span>
									</Button>
								</div>
							</Form.Item>
						</Col>
						<Col span={12} style={{paddingRight: 0, paddingLeft: 8}}>
							<Form.Item
								name="is_active"
								label="Status"
								valuePropName="checked"
								initialValue={true}
								rules={[{required: true, message: 'Please select Status!'}]}
							>
								<Switch size="default" checkedChildren="Active" unCheckedChildren="Inactive"/>
							</Form.Item>
						</Col>
					</Row>
					<Form.Item
						name="link_page"
						label="Link Page"
						rules={[{type: 'url', message: 'Please enter a valid URL!'}]}
					>
						<Input size="large" placeholder="Enter page URL"/>
					</Form.Item>
					<Form.Item
						name="description"
						label="Description"
					>
						<Input.TextArea size="large" placeholder="Enter service description" rows={4}/>
					</Form.Item>
					<Form.Item
						name="image_url"
						label="Image"
						rules={[{required: true, message: 'Please upload an image!'}]}
					>
						<Upload
							accept="image/*"
							showUploadList={false}
							beforeUpload={() => false}
							onChange={handleUploadChange}
							style={{width: '100%'}}
						>
							<Button
								type="dashed"
								style={{
									display: 'flex',
									flexDirection: 'column',
									alignItems: 'center',
									justifyContent: 'center',
									width: '100%',
									height: 80,
									padding: 12,
									borderRadius: 8,
									borderColor: '#3024DB',
								}}
							>
								<UploadOutlined style={{fontSize: 28, color: '#3024DB'}}/>
								<span style={{marginTop: 4, color: '#3024DB', fontWeight: 500}}>
                  Upload
                </span>
							</Button>
						</Upload>
						<div style={{fontSize: 12, color: '#888', marginTop: 6, textAlign: 'center'}}>
							Chỉ upload ảnh JPG, PNG, GIF. Kích thước tối đa 5MB.
						</div>
						{imageUrl && (
							<div style={{marginTop: 8, position: 'relative'}}>
								<img
									src={imageUrl}
									alt="Preview"
									style={{
										width: '100%',
										maxHeight: 200,
										objectFit: 'contain',
										borderRadius: 8,
										border: '1px solid #eee',
									}}
								/>
								<Button
									type="link"
									danger
									onClick={() => setImageUrl('')}
									style={{
										position: 'absolute',
										top: 8,
										right: 8,
										fontWeight: 'bold',
									}}
								>
									<DeleteOutlined style={{fontSize: 20}}/>
								</Button>
							</div>
						)}
					</Form.Item>
					{(isLoading || isLoadingUpdateService) && (
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
                Đang xử lý, vui lòng đợi...
              </span>
						</div>
					)}
				</Form>
			</Modal>
			<div
				className="p-4 shadow-lg"
				style={{
					borderRadius: 12,
					overflow: 'hidden',
					display: 'flex',
					flexDirection: 'column',
					minHeight: '80vh',
					backgroundColor: '#fff',
				}}
			>
				<div className="mb-4 flex flex-wrap items-center justify-between gap-2">
					<Space>
						<Input
							size="large"
							prefix={<SearchOutlined/>}
							placeholder="Search by name or description"
							value={searchText}
							onChange={handleSearch}
							style={{width: 250}}
						/>
						<Select
							size="large"
							value={filterStatus}
							onChange={handleFilterStatus}
							style={{width: 150}}
						>
							<Option value="all">All Status</Option>
							<Option value="active">Active</Option>
							<Option value="inactive">Inactive</Option>
						</Select>
					</Space>
					<Button
						size="large"
						type="primary"
						icon={<PlusOutlined/>}
						onClick={handleAdd}
					>
						Add New
					</Button>
				</div>
				<div style={{flex: 1, overflow: 'auto'}}>
					<Table
						loading={categoriesIsLoading || serviceIsLoading}
						rowKey={(record) => record.id}
						style={{width: '100%', flex: 1}}
						size="large"
						pagination={{
							size: 'default',
							total: filteredData?.length || 0,
							showSizeChanger: true,
							showQuickJumper: true,
							showTotal: (total) => `Tổng ${total} services`,
						}}
						columns={columns}
						dataSource={filteredData}
						className={styles.customTable}
					/>
				</div>
			</div>
		</>
	);
};

export default Services;
