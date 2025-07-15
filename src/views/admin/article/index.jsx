import React, {useEffect, useState} from 'react';
import {Avatar, Button, Col, DatePicker, Form, Input, message, Modal, Popconfirm, Row, Select, Space, Spin, Switch, Table, Upload} from 'antd';
import {DeleteOutlined, EditOutlined, PlusOutlined, SearchOutlined, UploadOutlined} from '@ant-design/icons';
import {createStyles} from 'antd-style';
import {Bounce, ToastContainer} from 'react-toastify';
import {useCreateArticleMutation, useDeleteArticleMutation, useGetArticleQuery, useUpdateArticleMutation} from '../../../features/article/article';
import ToastNotification from '../../../components/ToastNotification/ToastNotification';
import {Editor} from 'react-draft-wysiwyg';
import {ContentState, convertToRaw, EditorState} from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import {Icon} from '@iconify/react';
import dayjs from 'dayjs';
import {useGetCategoriesQuery} from '../../../features/categoryArticle/categoryArticle';

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

const Article = () => {
	const {styles} = useStyle();
	const {
		data: categoryArticles = [],
		error: categoryArticlesError,
		isLoading: categoryArticlesIsLoading,
		refetch: refetchCategoryArticles,
	} = useGetCategoriesQuery();
	const {
		data: articles = [],
		error: articleError,
		isLoading: articleIsLoading,
		refetch: refetchArticles,
	} = useGetArticleQuery();
	
	const [isAddModalVisible, setIsAddModalVisible] = useState(false);
	const [isEditModalVisible, setIsEditModalVisible] = useState(false);
	const [currentRecord, setCurrentRecord] = useState(null);
	const [form] = Form.useForm();
	const [thumbnailUrl, setThumbnailUrl] = useState(null);
	const [editorState, setEditorState] = useState(EditorState.createEmpty());
	
	useEffect(() => {
		if (isAddModalVisible) {
			setThumbnailUrl('');
			setEditorState(EditorState.createEmpty());
			form.resetFields();
		} else if (isEditModalVisible && currentRecord) {
			setThumbnailUrl(currentRecord.thumbnail_url);
			const contentBlocks = htmlToDraft(currentRecord.content || '');
			const contentState = ContentState.createFromBlockArray(contentBlocks.contentBlocks, contentBlocks.entityMap);
			setEditorState(EditorState.createWithContent(contentState));
			form.setFieldsValue({
				...currentRecord,
				category_id: currentRecord?.category?.id || undefined,
				published_at: currentRecord.published_at
					? dayjs(currentRecord.published_at)
					: null,
			});
		}
	}, [isAddModalVisible, isEditModalVisible, currentRecord, form]);
	
	const handleAdd = () => {
		setCurrentRecord(null);
		setIsAddModalVisible(true);
		setThumbnailUrl(null);
		setEditorState(EditorState.createEmpty());
		form.resetFields();
	};
	
	const handleEdit = (id) => {
		const record = articles.find((item) => item.id === id);
		if (record) {
			setCurrentRecord(record);
			setIsEditModalVisible(true);
		}
	};
	
	const handleDelete = async (id) => {
		try {
			const response = await submitDeleteArticle(id).unwrap();
			if (response) {
				refetchArticles();
				ToastNotification({
					type: 'success',
					title: 'Xóa bài viết thành công!',
					message: `Xóa bài viết thành công, ID: ${response?.article?.id} thành công.`,
				});
			}
		} catch (error) {
			ToastNotification({
				type: 'error',
				title: 'Xóa bài viết không thành công!',
				message: `Xóa bài viết không thành công, vui lòng thử lại sau. CODE: ${error.message}`,
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
			console.log('Image removed');
			setThumbnailUrl(null);
			form.setFieldsValue({thumbnail_url: null});
			return;
		}
		const fileObj = file.originFileObj || file;
		if (fileObj instanceof File) {
			console.log('File object:', fileObj);
			const reader = new FileReader();
			reader.onload = (e) => {
				console.log('FileReader result:', e.target.result);
				setThumbnailUrl(e.target.result);
				form.setFieldsValue({thumbnail_url: fileObj});
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
	
	const onEditorStateChange = (newEditorState) => {
		setEditorState(newEditorState);
		const content = draftToHtml(convertToRaw(newEditorState.getCurrentContent()));
		form.setFieldsValue({content});
	};
	
	const [submitArticle, {isLoading}] = useCreateArticleMutation();
	const [submitUpdateArticle, {isLoading: isLoadingUpdateArticle}] = useUpdateArticleMutation();
	const [submitDeleteArticle, {isLoading: isLoadingDeleteArticle}] = useDeleteArticleMutation();
	
	const handleSubmit = async () => {
		form
			.validateFields()
			.then(async (values) => {
				if (!thumbnailUrl) {
					ToastNotification({
						type: 'warn',
						title: 'Vui lòng tải lên hình ảnh!',
						message: 'Hình ảnh là bắt buộc để tạo hoặc cập nhật bài viết.',
					});
					return;
				}
				const payload = {
					...values,
					content: draftToHtml(convertToRaw(editorState.getCurrentContent())),
					published_at: values.published_at ? values.published_at.format('DD/MM/YYYY') : null,
					lock: values.lock ? values.lock : false,
				};
				
				console.log(payload);
				
				if (currentRecord) {
					const response = await submitUpdateArticle({
						...payload,
						article_id: currentRecord.id,
					}).unwrap();
					if (response) {
						refetchArticles();
						ToastNotification({
							type: 'success',
							title: 'Cập nhật bài viết thành công!',
							message: `Cập nhật bài viết, ID: ${response?.article?.id} thành công.`,
						});
					}
				} else {
					const response = await submitArticle(payload).unwrap();
					if (response) {
						refetchArticles();
						ToastNotification({
							type: 'success',
							title: 'Tạo bài viết thành công!',
							message: `Tạo bài viết thành công, ID: ${response?.article?.id} thành công.`,
						});
					}
				}
				setIsAddModalVisible(false);
				setIsEditModalVisible(false);
			})
			.catch((error) => {
				console.error('Validation failed:', error);
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
	
	const filteredData = articles.filter((item) => {
		const matchesSearch =
			item.title.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').includes(
				searchText.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, ''),
			) ||
			item.content.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').includes(
				searchText.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, ''),
			);
		const matchesStatus =
			filterStatus === 'all'
				? true
				: filterStatus === 'lock'
					? item.lock
					: !item.lock;
		return matchesSearch && matchesStatus;
	});
	
	const columns = [
		{
			title: 'Thumbnail',
			dataIndex: 'thumbnail_url',
			key: 'thumbnail_url',
			align: 'center',
			width: 130,
			render: (text) => (
				<img
					src={text}
					alt="thumbnail"
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
			title: 'Author',
			dataIndex: 'author',
			key: 'author',
			fixed: 'left',
			width: 170,
			align: 'center',
			render: (author) => (
				<span style={{display: 'flex', flexDirection: 'column', alignItems: 'center', fontWeight: 'bold', color: '#1a1a1a', gap: 8}}>
      <Avatar
	      size="large"
	      src={<img src={author.profile_image ? author.profile_image : 'https://placehold.co/50x50'} alt="avatar"/>}
      />
					{author.full_name}
    </span>
			),
		},
		{
			title: 'Title',
			dataIndex: 'title',
			key: 'title',
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
			title: 'Content',
			dataIndex: 'content',
			key: 'content',
			render: (text) => {
				const plainText = text?.replace(/<[^>]+>/g, '') || '';
				return (
					<span
						dangerouslySetInnerHTML={{
							__html:
								plainText.length > 50
									? plainText.slice(0, 50) + ' ...'
									: plainText,
						}}
					/>
				);
			},
		},
		{
			title: 'Category',
			dataIndex: 'category',
			key: 'category',
			width: 150,
			render: (category) => <span>{category?.name}</span>,
		},
		{
			title: 'Published At',
			dataIndex: 'published_at',
			key: 'published_at',
			align: 'center',
			width: 180,
			render: (text) => {
				if (!text) {
					return (
						<span style={{color: '#faad14', fontWeight: 500, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
          <Icon icon="mdi:clock-outline" style={{color: '#faad14', marginBottom: 6, fontSize: 32}}/>
          Not published
        </span>
					);
				}
				const publishedDate = new Date(text);
				const now = new Date();
				const diffTime = publishedDate.getTime() - now.getTime();
				const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
				const formatted = publishedDate.toLocaleDateString('vi-VN', {
					weekday: 'short',
					year: 'numeric',
					month: '2-digit',
					day: '2-digit',
				});
				if (diffDays > 0) {
					return (
						<span style={{color: '#1890ff', fontWeight: 500, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
            <Icon icon="mdi:calendar-clock" style={{color: '#1890ff', marginBottom: 6, fontSize: 32}}/>
            <span>{formatted}</span>
            <span style={{color: '#fa541c', marginTop: 4}}>({diffDays} days left)</span>
          </span>
					);
				} else {
					return (
						<span style={{color: '#52c41a', fontWeight: 500, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
            <Icon icon="mdi:calendar-check" style={{color: '#52c41a', marginBottom: 6, fontSize: 32}}/>
            <span>{formatted}</span>
            <span style={{color: '#fa541c', marginTop: 4}}>({Math.abs(diffDays)} days ago)</span>
          </span>
					);
				}
			},
		},
		{
			title: 'Clock',
			dataIndex: 'lock',
			key: 'lock',
			align: 'center',
			width: 120,
			render: (text) => (
				<span style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%'}}>
          {text === true ? (
	          <Icon icon="lets-icons:lock-duotone" width="24" height="24" style={{color: '#d00001'}}/>
          ) : (
	          <Icon icon="solar:lock-keyhole-unlocked-bold-duotone" width="24" height="24" style={{color: '#00d029'}}/>
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
						title="Bạn có chắc chắn muốn xóa bài viết này?"
						onConfirm={() => handleDelete(record.id)}
						okText={isLoadingDeleteArticle ? 'Đang xử lý ...' : 'Có, Hãy xóa'}
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
				title={currentRecord ? 'Update Article' : 'Add Article'}
				open={isAddModalVisible || isEditModalVisible}
				onCancel={() => {
					setIsAddModalVisible(false);
					setIsEditModalVisible(false);
					setThumbnailUrl('');
					setEditorState(EditorState.createEmpty());
					form.resetFields();
				}}
				onOk={handleSubmit}
				okText={isLoading || isLoadingUpdateArticle ? 'Đang xử lý ...' : currentRecord ? 'Update' : 'Create'}
				centered
				width="80vw"
				style={{maxHeight: '96vh', overflow: 'auto'}}
				bodyStyle={{maxHeight: '80vh', overflow: 'auto', padding: 6}}
				maskClosable={false}
				closable={true}
				keyboard={false}
			>
				<Form layout="vertical" form={form} style={{flex: 1, display: 'flex', flexDirection: 'column'}}>
					<div style={{position: 'relative', flex: '0 1 auto'}}>
						<Row gutter={16} style={{margin: 0}}>
							<Col span={12} style={{paddingRight: 8, paddingLeft: 0}}>
								<Form.Item
									name="title"
									label="Title"
									rules={[{required: true, message: 'Please input Title!'}]}
								>
									<Input size="large" placeholder=""/>
								</Form.Item>
							</Col>
							<Col span={12} style={{paddingRight: 0, paddingLeft: 8}}>
								<Form.Item
									name="category_id"
									label="Category"
									initialValue={currentRecord ? currentRecord.category_id : undefined}
									rules={[{required: true, message: 'Please select a Category!'}]}
									style={{marginBottom: 0}}
								>
									<Select size="large" placeholder="Select a category" style={{flex: 1}}>
										{categoryArticles.map((category) => (
											<Option key={category.id} value={category.id}>
												{category.name}
											</Option>
										))}
									</Select>
								</Form.Item>
							</Col>
						</Row>
						<Row gutter={16} style={{margin: 0}}>
							<Col span={12}>
								<Form.Item
									name="lock"
									label="Lock"
									valuePropName="checked"
									initialValue={false}
									rules={[{required: true, message: 'Please select Lock status!'}]}
								>
									<Switch size="default" checkedChildren="Locked" unCheckedChildren="Unlocked"/>
								</Form.Item>
							</Col>
							<Col span={12} style={{paddingRight: 0, paddingLeft: 8}}>
								<Form.Item
									name="published_at"
									label="Published At"
									rules={[{required: true, message: 'Please select Published At date!'}]}
								>
									<DatePicker size="large" format="DD/MM/YYYY" style={{width: '100%'}}/>
								</Form.Item>
							</Col>
						</Row>
						<Form.Item
							name="thumbnail_url"
							label="Thumbnail"
							rules={[{required: true, message: 'Please upload a thumbnail image!'}]}
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
							{thumbnailUrl && (
								<div style={{marginTop: 8, position: 'relative'}}>
									<img
										src={thumbnailUrl}
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
										onClick={() => setThumbnailUrl('')}
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
					</div>
					<Form.Item
						name="content"
						label="Content"
						rules={[{required: true, message: 'Please input Content!'}]}
						style={{flex: '1 1 auto', marginBottom: 0}}
					>
						<Editor
							editorState={editorState}
							onEditorStateChange={onEditorStateChange}
							wrapperClassName={styles.editor}
							editorStyle={{minHeight: '300px', overflow: 'auto', maxHeight: '400px'}}
							toolbar={{
								options: ['inline', 'blockType', 'fontSize', 'list', 'textAlign', 'colorPicker', 'link', 'embedded', 'image', 'remove', 'history', 'emoji'],
								image: {
									urlEnabled: true,
									uploadEnabled: false,
									previewImage: true,
									inputAccept: 'image/gif,image/jpeg,image/jpg,image/png',
									defaultSize: {width: '100%', height: 'auto'},
								},
							}}
						/>
					</Form.Item>
					{(isLoading || isLoadingUpdateArticle) && (
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
							placeholder="Search by title or content"
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
							<Option value="lock">Lock</Option>
							<Option value="unlock">Unlock</Option>
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
						loading={categoryArticlesIsLoading}
						rowKey={(record) => record.id}
						style={{width: '100%', flex: 1}}
						size="large"
						pagination={{
							size: 'default',
							total: filteredData?.length || 0,
							showSizeChanger: true,
							showQuickJumper: true,
							showTotal: (total) => `Tổng ${total} articles`,
						}}
						columns={columns}
						dataSource={filteredData}
					/>
				</div>
			</div>
		</>
	);
};

export default Article;
