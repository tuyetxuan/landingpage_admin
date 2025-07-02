import React, {useState} from 'react';
import {Button, Form, Input, Modal, Popconfirm, Select, Space, Table, Tag, Typography} from 'antd';
import {CheckCircleOutlined, DeleteOutlined, EditOutlined, EnvironmentOutlined, MailOutlined, MessageOutlined, PhoneOutlined, ReloadOutlined, SearchOutlined, UserOutlined,} from '@ant-design/icons';
import {createStyles} from 'antd-style';
import {useGetStatusContactsQuery} from '../../../features/statusContact/statusContact';
import ToastNotification from '../../../components/ToastNotification/ToastNotification';
import {Bounce, ToastContainer} from 'react-toastify';
import {useDeleteContactMutation, useGetContactQuery, useUpdateContactMutation} from "../../../features/contact/contact";
import {Editor} from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import {convertToRaw, EditorState} from "draft-js";
import draftToHtml from "draftjs-to-html";
import {useGetUserQuery} from "../../../features/user/user";


const {Option} = Select;
const {Title, Text, Paragraph} = Typography;

const InfoItem = ({icon, label, value, color}) => (
	<div
		className="rounded-[20px] bg-white bg-clip-border shadow-3xl shadow-shadow-500 p-3 flex items-center gap-3"
	>
		<div
			style={{
				backgroundColor: color,
				color: "#fff",
				borderRadius: "50%",
				width: 38,
				height: 38,
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
				fontSize: 16,
			}}
		>
			{icon}
		</div>
		<div>
			<Text strong>{label}</Text>
			<Paragraph style={{margin: 0}}>{value}</Paragraph>
		</div>
	</div>
);

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
	customButton: css`
        background-color: #3024db;
        border-color: #3024db;

        &:hover {
            background-color: #3f3fc5 !important;
            border-color: #3f3fc5 !important;
        }
	`,
	notesEditor: css`
        min-height: 100px;
        border: 1px solid #d9d9d9;
        padding: 8px;
        border-radius: 4px;
	`,
	
	editor: css`
        .rdw-editor-main {
            border: 1px solid #d9d9d9;
            border-radius: 4px;
            padding: 8px;
            min-height: 200px;
        }

        .rdw-link-modal {
            height: auto;
        }
	`,
}));

const Contact = () => {
	const [form] = Form.useForm();
	const {styles} = useStyle();
	const {
		data: InfoUser = [],
		error,
		isLoading: userIsLoading,
	} = useGetUserQuery();
	const {
		data: contacts = [],
		isLoading: isLoadingContacts,
		refetch: refetchContacts,
	} = useGetContactQuery();
	
	const {data: statuses = [], isLoading: isLoadingStatuses} = useGetStatusContactsQuery();
	const [updateContactStatus, {isLoading: isLoadingUpdateContactStatus}] = useUpdateContactMutation();
	const [deleteContact, {isLoading: isLoadingDeleteContact}] = useDeleteContactMutation();
	const [isInfoModalVisible, setIsInfoModalVisible] = useState(false);
	const [currentRecord, setCurrentRecord] = useState(null);
	const [searchText, setSearchText] = useState('');
	const [filterStatus, setFilterStatus] = useState('all');
	
	const [editorState, setEditorState] = useState(EditorState.createEmpty());
	const [showFullMessage, setShowFullMessage] = useState(false);
	const [showFullAddress, setShowFullAddress] = useState(false);
	
	const onEditorStateChange = (newEditorState) => {
		setEditorState(newEditorState);
		const content = draftToHtml(convertToRaw(newEditorState.getCurrentContent()));
		form.setFieldsValue({content});
	};
	
	const truncateText = (text, length = 10) => {
		if (!text || text === "Không có thông tin") return text;
		return text.length > length ? text.slice(0, length) + "..." : text;
	};
	
	const handleDelete = async (id) => {
		try {
			await deleteContact(id).unwrap();
			refetchContacts();
			ToastNotification({
				type: 'success',
				title: 'Xóa Contact thành công!',
				message: 'Contact đã được xóa thành công.',
			});
		} catch (error) {
			ToastNotification({
				type: 'error',
				title: 'Thông báo lỗi - Error!',
				message: error.message || 'Đã xảy ra lỗi khi xóa contact.',
			});
		}
	};
	
	const handleStatusChange = async (id, statusId, fromModal = false) => {
		try {
			const values = {contactId: id, status_id: statusId};
			const response = await updateContactStatus(values).unwrap();
			if (response) {
				refetchContacts();
				ToastNotification({
					type: 'success',
					title: 'Cập nhật trạng thái thành công!',
					message: `Cập nhật trạng thái cho ${response?.contact?.name} thành công.`,
				});
				if (fromModal) {
					setCurrentRecord({...currentRecord, status_id: statusId});
				}
			}
		} catch (error) {
			ToastNotification({
				type: 'error',
				title: 'Thông báo lỗi - Error!',
				message: error.message || 'Đã xảy ra lỗi khi cập nhật trạng thái.',
			});
		}
	};
	
	const handleShowInfo = (record) => {
		setCurrentRecord(record);
		setIsInfoModalVisible(true);
	};
	
	const handleSearch = (e) => {
		setSearchText(e.target.value);
	};
	
	const handleFilterStatus = (value) => {
		setFilterStatus(value);
	};
	
	const filteredData = contacts.filter((item) => {
		const matchesSearch =
			item.name.toLowerCase().includes(searchText.toLowerCase()) ||
			item.email.toLowerCase().includes(searchText.toLowerCase()) ||
			(item.phone || '').toLowerCase().includes(searchText.toLowerCase()) ||
			(item.address || '').toLowerCase().includes(searchText.toLowerCase());
		const matchesStatus = filterStatus === 'all' ? true : item.status_id === parseInt(filterStatus);
		return matchesSearch && matchesStatus;
	});
	
	const columns = [
		{
			title: 'Tên khách hàng',
			dataIndex: 'name',
			key: 'name',
			fixed: 'left',
			width: 150,
			render: (text) => <span style={{fontWeight: 'bold', color: '#1a1a1a'}}>{text}</span>,
		},
		{
			title: 'Nhân viên phụ trách',
			dataIndex: 'author',
			key: 'author',
			width: 150,
			render: (author) => {
				if (!author) return <span>Chưa xác định</span>;
				else return <span style={{fontWeight: 'bold', color: '#1a1a1a'}}>{author?.last_name + " " + author?.first_name}</span>;
			},
		},
		{
			title: 'Email',
			dataIndex: 'email',
			key: 'email',
			width: 200,
			render: (text) => <span style={{fontWeight: 'bold', color: '#1a1a1a'}}>{text}</span>,
		},
		{
			title: 'Số điện thoại',
			dataIndex: 'phone',
			key: 'phone',
			width: 150,
		},
		{
			title: 'Địa chỉ',
			dataIndex: 'address',
			key: 'address',
			width: 200,
			render: (text) => (
				<span>{text.length > 30 ? `${text.slice(0, 30)}...` : text}</span>
			),
		},
		{
			title: 'Yêu cầu tư vấn',
			dataIndex: 'message',
			key: 'message',
			width: 250,
			render: (text) => (
				<span>{text.length > 30 ? `${text.slice(0, 30)}...` : text}</span>
			),
		},
		{
			title: 'Ghi chú nhân viên',
			dataIndex: 'notes',
			key: 'notes',
			width: 200,
			render: (text) => <span>{text ? (text.length > 30 ? `${text.slice(0, 30)}...` : text) : ''}</span>,
		},
		{
			title: 'Trạng thái xử lý',
			dataIndex: 'status_id',
			key: 'status_id',
			align: 'center',
			width: 130,
			render: (statusId, record) => {
				const status = statuses.find((s) => s.id === statusId);
				const isCurrentUser = record.author && InfoUser?.user?.id === record.author?.id;
				if (isCurrentUser) {
					return (
						<Select
							size="large"
							value={statusId}
							onChange={(value) => handleStatusChange(record.id, value)}
							style={{width: 130}}
							loading={isLoadingStatuses}
						>
							{statuses?.map((status) => (
								<Option key={status.id} value={status.id}>
									{status.name}
								</Option>
							))}
						</Select>
					);
				} else {
					return (
						<Tag color="green" style={{fontWeight: 'bold'}}>
							{status ? status.name : 'Chưa xác định'}
						</Tag>
					);
				}
			},
		},
		{
			title: 'Ngày gửi yêu cầu',
			dataIndex: 'created_at',
			key: 'created_at',
			width: 150,
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
			title: 'Hành động',
			key: 'action',
			width: 150,
			align: 'center',
			render: (_, record) => (
				<Space size="middle">
					{!record.author ? (
						<Button
							size="large"
							type="primary"
							onClick={() => {
								// TODO: handle nhận xử lý ở đây
							}}
						>
							Tiếp nhận
						</Button>
					) : (
						(InfoUser?.user?.id === record.author?.id) ? (
							<>
								<Button
									size="large"
									type="link"
									icon={<EditOutlined/>}
									onClick={() => handleShowInfo(record)}
								/>
								<Popconfirm
									title={`Bạn có chắc chắn muốn xóa Contact của khách hàng ${record.name}?`}
									onConfirm={() => handleDelete(record.id)}
									okText={isLoadingDeleteContact ? 'Đang xử lý ...' : 'Có, Hãy xóa'}
									cancelText="Không"
									placement="left"
								>
									<Button type="link" danger icon={<DeleteOutlined/>}/>
								</Popconfirm>
							</>
						) : (
							<Typography.Text type="success" style={{fontWeight: 500}}>
								Đã có người tiếp nhận
							</Typography.Text>
						)
					)}
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
				title={
					<span>
			          <UserOutlined style={{marginRight: 8}}/>
			          Thông tin chi tiết - {currentRecord?.name}
			        </span>
				}
				centered
				open={isInfoModalVisible}
				onCancel={() => {
					setIsInfoModalVisible(false)
					setEditorState(EditorState.createEmpty())
					form.resetFields();
				}}
				width={1200}
				footer={[
					<Button size="large" key="cancel" onClick={() => {
						setIsInfoModalVisible(false)
						setEditorState(EditorState.createEmpty())
						form.resetFields();
					}}>
						Đóng
					</Button>,
					<Button
						size="large"
						key="submit"
						type="primary"
						loading={isLoadingUpdateContactStatus}
						onClick={() => handleStatusChange(currentRecord?.id, currentRecord?.status_id)}
					>
						Cập nhật dữ liệu
					</Button>,
				]}
			>
				<Space direction="vertical" size="large" style={{width: "100%"}}>
					<div className="grid grid-cols-4 gap-4">
						<InfoItem
							icon={<UserOutlined/>}
							label="Tên khách hàng"
							value={currentRecord?.name}
							color="#1890ff"
						/>
						<InfoItem
							icon={<MailOutlined/>}
							label="Email"
							value={currentRecord?.email}
							color="#722ed1"
						/>
						<InfoItem
							icon={<PhoneOutlined/>}
							label="Số điện thoại"
							value={currentRecord?.phone || "Không có"}
							color="#fa8c16"
						/>
						<InfoItem
							icon={<CheckCircleOutlined/>}
							label="Trạng thái xử lý"
							value={currentRecord?.status?.name || "Chưa xác định"}
							color="#52c41a"
						/>
					</div>
					<div className="grid grid-rows-2 gap-4">
						<InfoItem
							icon={<EnvironmentOutlined/>}
							label="Địa chỉ"
							value={
								<span>
								{showFullAddress ? currentRecord?.address : truncateText(currentRecord?.address, 30)}
									{currentRecord?.address && currentRecord.address.length > 30 && (
										<Button
											type="link"
											variant="filled"
											size="small"
											onClick={() => setShowFullAddress(!showFullAddress)}
											style={{marginLeft: 8}}
										>
											{showFullAddress ? "Thu gọn" : "Xem tất cả"}
										</Button>
									)}
							</span>
							}
							color="#13c2c2"
						/>
						<InfoItem
							icon={<MessageOutlined/>}
							label="Yêu cầu tư vấn"
							value={
								<span>
								{showFullMessage ? currentRecord?.message : truncateText(currentRecord?.message, 30)}
									{currentRecord?.message && currentRecord.message.length > 30 && (
										<Button
											type="link"
											size="small"
											onClick={() => setShowFullMessage(!showFullMessage)}
											style={{marginLeft: 8}}
										>
											{showFullMessage ? "Thu gọn" : "Xem tất cả"}
										</Button>
									)}
							</span>
							}
							color="#eb2f96"
						/>
					</div>
					<div>
						<Title level={5} style={{marginBottom: 8}}>
							<CheckCircleOutlined style={{marginRight: 8, color: "#52c41a"}}/>
							Trạng thái
						</Title>
						<Select
							size="large"
							style={{width: "100%"}}
							value={currentRecord?.status_id}
							onChange={(value) => handleStatusChange(currentRecord?.id, value, true)}
							loading={isLoadingUpdateContactStatus}
						>
							{statuses.map((status) => (
								<Option key={status.id} value={status.id}>
									{status.name}
								</Option>
							))}
						</Select>
					</div>
					<div>
						<Title level={5} style={{marginBottom: 8}}>
							<EditOutlined size="large" style={{marginRight: 8, color: "#faad14"}}/>
							Ghi chú nhân viên
						</Title>
						<Editor
							editorState={editorState}
							onEditorStateChange={onEditorStateChange}
							wrapperClassName={styles.editor}
							editorStyle={{minHeight: '300px', overflow: 'auto', maxHeight: '400px'}}
							toolbar={{
								options: ['inline', 'fontSize', 'list', 'textAlign', 'colorPicker', 'remove', 'history', 'emoji'],
							}}
						/>
					</div>
				</Space>
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
							placeholder="Tìm kiếm theo tên, email, số điện thoại hoặc địa chỉ"
							value={searchText}
							onChange={handleSearch}
							style={{width: 300}}
						/>
						<Select
							size="large"
							value={filterStatus}
							onChange={handleFilterStatus}
							style={{width: 200}}
							loading={isLoadingStatuses}
						>
							<Option value="all">Tất cả trạng thái</Option>
							{statuses.map((status) => (
								<Option key={status.id} value={status.id}>
									{status.name}
								</Option>
							))}
						</Select>
					</Space>
					<Button
						size="large"
						type="primary"
						className={styles.customButton}
						icon={<ReloadOutlined/>}
						onClick={refetchContacts}
					>
						Refresh Contacts
					</Button>
				</div>
				<div style={{flex: 1, overflow: 'auto'}}>
					<Table
						rowKey={(record) => record.id}
						style={{width: '100%', flex: 1}}
						size="large"
						pagination={{
							size: 'default',
							total: filteredData?.length || 0,
							showSizeChanger: true,
							showQuickJumper: true,
							showTotal: (total) => `Tổng ${total} contacts`,
						}}
						columns={columns}
						dataSource={filteredData}
						loading={isLoadingContacts}
						className={styles.customTable}
					/>
				</div>
			</div>
		</>
	);
};

export default Contact;
