import React, { startTransition, useEffect, useState } from 'react';
import { Button, Form, Input, message, Modal, Popconfirm, Select, Space, Spin, Switch, Table, Tag, Upload } from 'antd';
import { CheckCircleTwoTone, CloseCircleTwoTone, DeleteOutlined, EditOutlined, PlusOutlined, SearchOutlined, UploadOutlined } from '@ant-design/icons';
import { createStyles } from 'antd-style';
import { Bounce, ToastContainer } from 'react-toastify';
import { useCreateBannerMutation, useDeleteBannerMutation, useGetBannerQuery, useUpdateBannerMutation } from '../../../features/banner/banner';
import ToastNotification from '../../../components/ToastNotification/ToastNotification';

const { Option } = Select;

const useStyle = createStyles(({ css }) => ({
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

const Banner = () => {
  const { styles } = useStyle();
  const {
    data: banners = [],
    error,
    isLoading: bannerIsLoading,
    refetch: refetchBanners,
  } = useGetBannerQuery();
  
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [currentRecord, setCurrentRecord] = useState(null);
  const [form] = Form.useForm();
  const [imageUrl, setImageUrl] = useState('');
  const [searchText, setSearchText] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  
  useEffect(() => {
    if (isAddModalVisible) {
      setImageUrl('');
      form.resetFields();
    } else if (isEditModalVisible && currentRecord) {
      setImageUrl(currentRecord.image_url);
      form.setFieldsValue(currentRecord);
    }
  }, [isAddModalVisible, isEditModalVisible, currentRecord, form]);
  
  const handleAdd = () => {
    setCurrentRecord(null);
    setIsAddModalVisible(true);
    setImageUrl('');
    form.resetFields();
  };
  
  const handleEdit = (id) => {
    startTransition(() => {
      const record = banners.find((item) => item.id === id);
      if (record) {
        setCurrentRecord(record);
        setIsEditModalVisible(true);
      }
    });
  };
  
  const handleDelete = async (id) => {
    console.log(id);
    try {
      const response = await submitDeleteBanner(id).unwrap();
      if (response) {
        refetchBanners();
        ToastNotification({
          type: 'success',
          title: 'Xóa banner thành công !',
          message: `Xóa banner thành công, ID: ${response?.banner?.id} thành công.`,
        });
      }
    } catch (error) {
      ToastNotification({
        type: 'error',
        title: 'Xóa banner không thành công !',
        message: `Xóa banner không thành công, vui lòng thử lại sau. CODE: ${error.message}`,
      });
    }
  };
  
  const handleSearch = (e) => {
    startTransition(() => {
      setSearchText(e.target.value);
    });
  };
  
  const handleFilterStatus = (value) => {
    startTransition(() => {
      setFilterStatus(value);
    });
  };
  
  const handleUploadChange = ({ file }) => {
    if (file.status === 'removed') {
      console.log('Image removed');
      setImageUrl('');
      form.setFieldsValue({ image_url: '' });
      return;
    }
    const fileObj = file.originFileObj || file;
    if (fileObj instanceof File) {
      console.log('File object:', fileObj);
      const reader = new FileReader();
      reader.onload = (e) => {
        console.log('FileReader result:', e.target.result);
        setImageUrl(e.target.result);
        form.setFieldsValue({ image_url: fileObj });
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
  
  const [submitBanner, { isLoading }] = useCreateBannerMutation();
  const [submitUpdateBanner, { isLoading: isLoadingUpdateBanner }] = useUpdateBannerMutation();
  const [submitDeleteBanner, { isLoading: isLoadingDeleteBanner }] = useDeleteBannerMutation();
  
  const handleSubmit = async () => {
    form
      .validateFields()
      .then(async (values) => {
        if (!imageUrl) {
          ToastNotification({
            type: 'warn',
            title: 'Vui lòng tải lên hình ảnh !',
            message: 'Hình ảnh là bắt buộc để tạo hoặc cập nhật banner.',
          });
          return;
        }
        if (currentRecord) {
          const response = await submitUpdateBanner({
            ...values,
            id: currentRecord.id,
          }).unwrap();
          if (response) {
            refetchBanners();
            ToastNotification({
              type: 'success',
              title: 'Cập nhật banner thành công !',
              message: `Cập nhật banner, ID: ${response?.banner?.id} thành công.`,
            });
          }
        } else {
          const response = await submitBanner(values).unwrap();
          if (response) {
            refetchBanners();
            ToastNotification({
              type: 'success',
              title: 'Tạo banner thành công!',
              message: `Tạo banner thành công, ID: ${response?.banner?.id} thành công.`,
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
  
  const filteredData = banners.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').includes(
        searchText.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, ''),
      ) ||
      item.description.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').includes(
        searchText.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, ''),
      );
    const matchesStatus =
      filterStatus === 'all' ? true : filterStatus === 'active' ? item.is_active : !item.is_active;
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
      align: 'left',
      render: (author) => (
        <span style={{ fontWeight: 'bold', color: '#1a1a1a' }}>
          {author.first_name + ' ' + author.last_name}
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
          return (
            <span style={{ fontWeight: 'bold', color: '#1a1a1a' }}>
              {words.slice(0, 10).join(' ')} ...
            </span>
          );
        }
        return <span style={{ fontWeight: 'bold', color: '#1a1a1a' }}>{text}</span>;
      },
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      render: (text) => {
        const words = text.split(/\s+/);
        if (words.length > 10) {
          return <span>{words.slice(0, 10).join(' ')} ...</span>;
        }
        return <span>{text}</span>;
      },
    },
    {
      title: 'Status',
      dataIndex: 'is_active',
      key: 'is_active',
      align: 'center',
      width: 120,
      render: (isActive) =>
        isActive ? (
          <Tag color="green" bordered={false} icon={<CheckCircleTwoTone twoToneColor="#52c41a" />}>
            Active
          </Tag>
        ) : (
          <Tag color="red" bordered={false} icon={<CloseCircleTwoTone twoToneColor="#ff4d4f" />}>
            Inactive
          </Tag>
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
        const weekday = date.toLocaleDateString('vi-VN', { weekday: 'short' });
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
          <Button type="link" icon={<EditOutlined />} onClick={() => handleEdit(record.id)} />
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa banner này?"
            onConfirm={() => handleDelete(record.id)}
            okText={isLoadingDeleteBanner ? 'Đang xử lý ...' : 'Có, Hãy xóa'}
            cancelText="Không"
            placement="left"
          >
            <Button type="link" danger icon={<DeleteOutlined />} />
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
      />
      {bannerIsLoading ? (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '80vh',
          }}
        >
          <Spin size="large" />
        </div>
      ) : error ? (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '80vh',
            color: 'red',
          }}
        >
          Lỗi khi tải dữ liệu: {error.message}
        </div>
      ) : (
        <>
          <Modal
            title={currentRecord ? 'Update Banner' : 'Add Banner'}
            open={isAddModalVisible || isEditModalVisible}
            onCancel={() => {
              setIsAddModalVisible(false);
              setIsEditModalVisible(false);
              setImageUrl('');
              form.resetFields();
            }}
            onOk={handleSubmit}
            okText={isLoading || isLoadingUpdateBanner ? 'Đang xử lý ...' : currentRecord ? 'Update' : 'Create'}
            centered
          >
            <Form layout="vertical" form={form}>
              <div style={{ position: 'relative' }}>
                <Form.Item
                  name="title"
                  label="Title"
                  rules={[{ required: true, message: 'Please input Title!' }]}
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  name="description"
                  label="Description"
                  rules={[{ required: true, message: 'Please input Description!' }]}
                >
                  <Input.TextArea
                    rows={3}
                    style={{ maxHeight: 150, overflow: 'auto', minHeight: 80 }}
                  />
                </Form.Item>
                <Form.Item
                  name="is_active"
                  label="Status"
                  valuePropName="checked"
                  initialValue={true}
                  rules={[{ required: true, message: 'Please select Status!' }]}
                >
                  <Switch checkedChildren="Active" unCheckedChildren="Inactive" />
                </Form.Item>
                <Form.Item
                  name="image_url"
                  label="Image"
                  rules={[{ required: true, message: 'Please upload an image!' }]}
                >
                  <Upload
                    accept="image/*"
                    showUploadList={false}
                    beforeUpload={() => false}
                    onChange={handleUploadChange}
                  >
                    <Button
                      type="dashed"
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: 472,
                        height: 80,
                        padding: 12,
                        borderRadius: 8,
                        borderColor: '#3024DB',
                      }}
                    >
                      <UploadOutlined style={{ fontSize: 28, color: '#3024DB' }} />
                      <span style={{ marginTop: 4, color: '#3024DB', fontWeight: 500 }}>
                        Upload
                      </span>
                    </Button>
                  </Upload>
                  <div style={{ fontSize: 12, color: '#888', marginTop: 4 }}>
                    Chỉ upload ảnh JPG, PNG, GIF. Kích thước tối đa 5MB.
                  </div>
                  {imageUrl && (
                    <div style={{ marginTop: 8, position: 'relative' }}>
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
                        <DeleteOutlined style={{ fontSize: 20 }} />
                      </Button>
                    </div>
                  )}
                </Form.Item>
                {(isLoading || isLoadingUpdateBanner) && (
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
                    <Spin size="large" />
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
              </div>
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
                  prefix={<SearchOutlined />}
                  placeholder="Search by title or description"
                  value={searchText}
                  onChange={handleSearch}
                  style={{ width: 250 }}
                />
                <Select
                  size="large"
                  value={filterStatus}
                  onChange={handleFilterStatus}
                  style={{ width: 150 }}
                >
                  <Option value="all">All Status</Option>
                  <Option value="active">Active</Option>
                  <Option value="inactive">Inactive</Option>
                </Select>
              </Space>
              <Button
                size="large"
                type="primary"
                className={styles.customButton}
                icon={<PlusOutlined />}
                onClick={handleAdd}
              >
                Add New
              </Button>
            </div>
            <div style={{ flex: 1, overflow: 'auto' }}>
              <Table
                loading={bannerIsLoading}
                rowKey={(record) => record.id}
                style={{ width: '100%', flex: 1 }}
                size="large"
                pagination={{
                  size: 'default',
                  total: filteredData?.length || 0,
                  showSizeChanger: true,
                  showQuickJumper: true,
                  showTotal: (total) => `Tổng ${total} banners`,
                }}
                columns={columns}
                dataSource={filteredData}
              />
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Banner;
