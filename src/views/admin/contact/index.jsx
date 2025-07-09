import React, {useEffect, useState} from 'react';
import {Button, Form, Input, Modal, Popconfirm, Select, Space, Spin, Table, Tag, Typography} from 'antd';
import {CheckCircleOutlined, DeleteOutlined, EditOutlined, EnvironmentOutlined, MailOutlined, MessageOutlined, PhoneOutlined, ReloadOutlined, SearchOutlined, UserOutlined,} from '@ant-design/icons';
import {createStyles} from 'antd-style';
import {useGetStatusContactsQuery} from '../../../features/statusContact/statusContact';
import ToastNotification from '../../../components/ToastNotification/ToastNotification';
import {Bounce, ToastContainer} from 'react-toastify';
import {useDeleteContactMutation, useGetContactQuery, useUpdateContactAuthorMutation, useUpdateContactMutation, useUpdateStatusMutation} from "../../../features/contact/contact";
import {Editor} from 'react-draft-wysiwyg';
import htmlToDraft from 'html-to-draftjs';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import {ContentState, convertToRaw, EditorState} from "draft-js";
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
	} = useGetContactQuery(undefined, {
		pollingInterval: 2000,
	});
	
	const {data: statuses = [], isLoading: isLoadingStatuses} = useGetStatusContactsQuery();
	const [isInfoModalVisible, setIsInfoModalVisible] = useState(false);
	const [currentRecord, setCurrentRecord] = useState(null);
	const [searchText, setSearchText] = useState('');
	const [filterStatus, setFilterStatus] = useState('all');
	const [status, setStatus] = useState(null);
	const [editorState, setEditorState] = useState(EditorState.createEmpty());
	const [showFullMessage, setShowFullMessage] = useState(false);
	const [showFullAddress, setShowFullAddress] = useState(false);
	
	useEffect(() => {
		if (currentRecord && currentRecord?.notes) {
			const contentBlocks = htmlToDraft(currentRecord.notes || '');
			const contentState = ContentState.createFromBlockArray(contentBlocks.contentBlocks, contentBlocks.entityMap);
			setEditorState(EditorState.createWithContent(contentState));
		}
	}, [currentRecord]);
	
	const onEditorStateChange = (newEditorState) => {
		setEditorState(newEditorState);
		const content = draftToHtml(convertToRaw(newEditorState.getCurrentContent()));
		form.setFieldsValue({content});
	};
	
	const truncateText = (text, length = 10) => {
		if (!text || text === "Không có thông tin") return text;
		return text.length > length ? text.slice(0, length) + "..." : text;
	};
	
	const [deleteContact, {isLoading: isLoadingDeleteContact}] = useDeleteContactMutation();
	const handleDelete = async (id) => {
		try {
			const response = await deleteContact(id).unwrap();
			refetchContacts();
			ToastNotification({
				type: 'success',
				title: 'Xóa Contact thành công!',
				message: `Bạn đã xóa contact của khách hàng ${response?.contact?.name} thành công.`,
			});
		} catch (error) {
			ToastNotification({
				type: 'error',
				title: 'Thông báo lỗi - Error!',
				message: error.message || 'Đã xảy ra lỗi khi xóa contact.',
			});
		}
	};
	
	const [submitUpdateAuthor, {isLoading: isLoadingUpdateAuthor}] = useUpdateContactAuthorMutation();
	const handleUpdateAuthor = async (id) => {
		try {
			const payload = {id: id};
			const response = await submitUpdateAuthor(payload).unwrap();
			refetchContacts();
			ToastNotification({
				type: 'success',
				title: 'Tiếp nhận xử lý Contact thành công!',
				message: `Bạn đã tiếp nhận xử lý ${response?.contact?.name} thành công.`,
			});
			setIsInfoModalVisible(false);
			form.resetFields();
			setEditorState(EditorState.createEmpty());
			setCurrentRecord(null);
		} catch (error) {
			ToastNotification({
				type: 'error',
				title: 'Thông báo lỗi - Error!',
				message: error.message || 'Đã xảy ra lỗi khi cập nhật contact.',
			});
		}
	}
	
	const [submitUpdateContact, {isLoading: isLoadingUpdateContact}] = useUpdateContactMutation();
	const handleSubmit = async () => {
		try {
			const payload = {
				id: currentRecord.id,
				status_id: currentRecord.status_id,
				notes: draftToHtml(convertToRaw(editorState.getCurrentContent())),
			};
			const response = await submitUpdateContact(payload).unwrap();
			refetchContacts();
			ToastNotification({
				type: 'success',
				title: 'Cập nhật Contact thành công!',
				message: `Cập nhật thông tin cho ${response?.contact?.name} thành công.`,
			});
			setIsInfoModalVisible(false);
			form.resetFields();
			setEditorState(EditorState.createEmpty());
			setCurrentRecord(null);
		} catch (error) {
			ToastNotification({
				type: 'error',
				title: 'Thông báo lỗi - Error!',
				message: error.message || 'Đã xảy ra lỗi khi cập nhật contact.',
			});
		}
	};
	
	const [submitUpdateStatus, {isLoading: isLoadingUpdateStatus}] = useUpdateStatusMutation();
	const handleStatusChange = async (id, statusId) => {
		try {
			const values = {id: id, status_id: statusId};
			const response = await submitUpdateStatus(values).unwrap();
			if (response) {
				refetchContacts();
				ToastNotification({
					type: 'success',
					title: 'Cập nhật trạng thái thành công!',
					message: `Cập nhật trạng thái cho ${response?.contact?.name} thành công.`,
				});
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
			render: (text) => <span dangerouslySetInnerHTML={{__html: text ? (text.length > 30 ? `${text.slice(0, 30)}...` : text) : ''}}/>,
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
						<Popconfirm
							title={`Bạn có chắc chắn muốn tiếp nhận xử lý Contact của khách hàng ${record.name}?`}
							onConfirm={() => handleUpdateAuthor(record.id)}
							okText={isLoadingUpdateAuthor ? 'Đang xử lý ...' : 'Có, Tiếp nhận'}
							cancelText="Không"
							placement="left"
						>
							<Button
								size="large"
								type="primary"
							>
								Tiếp nhận
							</Button>
						</Popconfirm>
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
					setIsInfoModalVisible(false);
					setCurrentRecord(null);
					setEditorState(EditorState.createEmpty());
					form.resetFields();
				}}
				width={1200}
				footer={[
					<Button
						size="large" key="cancel" onClick={() => {
						setIsInfoModalVisible(false)
						setEditorState(EditorState.createEmpty())
						form.resetFields();
						setCurrentRecord(null);
					}}>
						Đóng
					</Button>,
					<Button
						size="large"
						key="submit"
						type="primary"
						loading={isLoadingUpdateContact}
						onClick={handleSubmit}
					>
						{isLoadingUpdateContact ? 'Đang xử lý ...' : 'Cập nhật thông tin'}
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
							onChange={(value) => {
								setCurrentRecord({...currentRecord, status_id: value});
							}}
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
				{(isLoadingUpdateContact) && (
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
