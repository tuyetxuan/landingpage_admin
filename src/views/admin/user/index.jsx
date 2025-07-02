import React, { useEffect, useState } from 'react';
import { Avatar, Button, Form, Input, Modal, Popconfirm, Radio, Select, Space, Spin, Switch, Table, Tag } from 'antd';
import { CheckCircleTwoTone, CloseCircleTwoTone, LockOutlined, PlusOutlined, RedoOutlined, SearchOutlined, UserOutlined } from '@ant-design/icons';
import { createStyles } from 'antd-style';
import { useCreateUserMutation, useGetAllUserQuery, useResetPasswordMutation, useUpdateUserRoleMutation, useUpdateUserStatusMutation } from '../../../features/user/user';
import ToastNotification from '../../../components/ToastNotification/ToastNotification';
import { Bounce, ToastContainer } from 'react-toastify';

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

const RoleConfirmModal = ({ visible, onConfirm, onCancel, record, newRole, isLoadingUpdateUserRole }) => {
  return (
    <Modal
      title={
        <span>
      <CheckCircleTwoTone twoToneColor="#52c41a" style={{ marginRight: 8 }} />
      Xác nhận thay đổi quyền
      </span>
      }
      centered
      open={visible}
      onOk={onConfirm}
      onCancel={onCancel}
      okText={isLoadingUpdateUserRole ? 'Đang xử lý...' : 'Xác nhận'}
      cancelText="Hủy"
    >
      <p>
        Bạn có chắc chắn muốn thay đổi quyền của <strong>{record?.full_name}</strong> thành{' '}
        <strong>{newRole ? newRole.charAt(0).toUpperCase() + newRole.slice(1) : ''}</strong>?
      </p>
    </Modal>
  );
};

const User = () => {
  const { styles } = useStyle();
  const {
    data: users = [],
    error: userError,
    isLoading: isLoadingUsers,
    refetch: refetchUsers,
  } = useGetAllUserQuery();
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [isRoleConfirmModalVisible, setIsRoleConfirmModalVisible] = useState(false);
  const [currentRecord, setCurrentRecord] = useState(null);
  const [pendingRoleChange, setPendingRoleChange] = useState(null);
  const [form] = Form.useForm();
  
  useEffect(() => {
    if (isAddModalVisible) {
      form.resetFields();
    }
  }, [isAddModalVisible, currentRecord, form]);
  
  const handleAdd = () => {
    setCurrentRecord(null);
    setIsAddModalVisible(true);
  };
  
  const [submitResetPassword, { isLoading: isLoadingResetPassword }] = useResetPasswordMutation();
  const handleResetPassword = async (id) => {
    if (id) {
      try {
        const response = await submitResetPassword(
          { userId: id },
        ).unwrap();
        if (response) {
          refetchUsers();
          ToastNotification({
            type: 'success',
            title: 'Reset Password User thành công !',
            message: `Reset Password User cho USER_NAME: ${response?.user?.username} thành công.`,
          });
        }
      } catch (error) {
        ToastNotification({
          type: 'error',
          title: 'Thông báo lỗi - Error!',
          message: error.message || 'Đã xảy ra lỗi khi Reset Password User.',
        });
      }
    }
  };
  
  const [submitUpdateUserStatus, { isLoading: isLoadingUpdateUserStatus }] = useUpdateUserStatusMutation();
  const handleLockAccount = async (id, isActive) => {
    if (id) {
      try {
        const response = await submitUpdateUserStatus(
          { userId: id },
        ).unwrap();
        if (response) {
          refetchUsers();
          ToastNotification({
            type: 'success',
            title: 'Thay đổi trạng thái tài khoản User thành công !',
            message: `Thay đổi trạng thái tài khoản User cho USER_NAME: ${response?.user?.username} thành công.`,
          });
        }
      } catch (error) {
        ToastNotification({
          type: 'error',
          title: 'Thông báo lỗi - Error!',
          message: error.message || 'Đã xảy ra lỗi khi thay đổi trang thái tài khoản.',
        });
      }
    }
  };
  
  const handleRoleChangeRequest = (id, role, record) => {
    setPendingRoleChange({ id, role, record });
    setIsRoleConfirmModalVisible(true);
  };
  
  const [submitUpdateUserRole, { isLoading: isLoadingUpdateUserRole }] = useUpdateUserRoleMutation();
  const handleRoleChangeConfirm = async () => {
    if (pendingRoleChange) {
      const values = {
        userId: pendingRoleChange.id,
        role: pendingRoleChange.role,
      };
      try {
        const response = await submitUpdateUserRole(values).unwrap();
        if (response) {
          refetchUsers();
          ToastNotification({
            type: 'success',
            title: 'Thay đổi quyền User thành công !',
            message: `Thay đổi quyền User cho USER_NAME: ${response?.user?.username} thành công.`,
          });
          setIsRoleConfirmModalVisible(false);
          setPendingRoleChange(null);
        }
      } catch (error) {
        ToastNotification({
          type: 'error',
          title: 'Thông báo lỗi - Error!',
          message: error.message || 'Đã xảy ra lỗi khi thay đổi quyền người dùng.',
        });
        setIsRoleConfirmModalVisible(false);
        setPendingRoleChange(null);
      }
    }
  };
  
  const handleRoleChangeCancel = () => {
    setIsRoleConfirmModalVisible(false);
    setPendingRoleChange(null);
  };
  
  const handleSearch = (e) => {
    setSearchText(e.target.value);
  };
  
  const handleFilterStatus = (value) => {
    setFilterStatus(value);
  };
  
  const [submitUser, { isLoading: isLoadingUser }] = useCreateUserMutation();
  const handleSubmit = async () => {
    form
      .validateFields()
      .then(async (values) => {
        const response = await submitUser(values).unwrap();
        if (response) {
          refetchUsers();
          ToastNotification({
            type: 'success',
            title: 'Tạo User thành công !',
            message: `Tạo User, USER_NAME: ${response?.user?.username} thành công.`,
          });
        }
        setIsAddModalVisible(false);
      })
      .catch((error) => {
        console.log(error);
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
  
  const filteredData = users.filter((item) => {
    const matchesSearch =
      item.username.toLowerCase().includes(searchText.toLowerCase()) ||
      item.email.toLowerCase().includes(searchText.toLowerCase()) ||
      item.first_name.toLowerCase().includes(searchText.toLowerCase()) ||
      item.last_name.toLowerCase().includes(searchText.toLowerCase());
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
      title: 'Username',
      dataIndex: 'username',
      key: 'username',
      fixed: 'left',
      width: 130,
      render: (text) => (
        <span style={{ fontWeight: 'bold', color: '#1a1a1a' }}>
          {text ? `${text.slice(0, 4)}***${text.slice(-5)}`.toLowerCase() : ''}
        </span>
      ),
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      width: 280,
      render: (text) => (
        <span style={{ fontWeight: 'bold', color: '#1a1a1a' }}>{text}</span>
      ),
    },
    {
      title: 'First Name',
      dataIndex: 'first_name',
      key: 'first_name',
    },
    {
      title: 'Last Name',
      dataIndex: 'last_name',
      key: 'last_name',
    },
    {
      title: 'Profile Image',
      dataIndex: 'profile_image',
      key: 'profile_image',
      align: 'center',
      render: (text) =>
        text ? (
          <Avatar
            size="large"
            src={<img src={text || 'https://placehold.co/50x50'} alt={text} />}
          />
        ) : (
          <Avatar size="large" icon={<UserOutlined />} />
        ),
    },
    {
      title: 'Gender',
      dataIndex: 'gender',
      key: 'gender',
      align: 'center',
      render: (text) => {
        if (text === 'nam') return 'Nam';
        if (text === 'nu') return 'Nữ';
        return 'Khác';
      },
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
      align: 'center',
      render: (text, record) => (
        <Space>
          <Radio.Group
            value={text}
            onChange={(e) => handleRoleChangeRequest(record.id, e.target.value, record)}
          >
            <Radio.Button
              value="admin"
              style={{
                backgroundColor: text === 'admin' ? '#3024DB' : undefined,
                fontWeight: text === 'admin' ? 'bold' : undefined,
                color: text === 'admin' ? '#fff' : undefined,
              }}
            >
              Admin
            </Radio.Button>
            <Radio.Button
              value="editor"
              style={{
                backgroundColor: text === 'editor' ? '#3024DB' : undefined,
                fontWeight: text === 'editor' ? 'bold' : undefined,
                color: text === 'editor' ? '#fff' : undefined,
              }}
            >
              Editor
            </Radio.Button>
          </Radio.Group>
        </Space>
      ),
    },
    {
      title: 'Password',
      dataIndex: 'password_hash',
      key: 'password_hash',
      align: 'center',
      render: () => '******',
    },
    {
      title: 'Status',
      dataIndex: 'is_active',
      key: 'is_active',
      align: 'center',
      render: (isActive) =>
        isActive ? (
          <Tag
            color="green"
            bordered={false}
            icon={<CheckCircleTwoTone twoToneColor="#52c41a" />}
          >
            Active
          </Tag>
        ) : (
          <Tag
            bordered={false}
            color="red"
            icon={<CloseCircleTwoTone twoToneColor="#ff4d4f" />}
          >
            Inactive
          </Tag>
        ),
    },
    {
      title: 'Created At',
      dataIndex: 'created_at',
      key: 'created_at',
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
          <Popconfirm
            title="Bạn có chắc chắn muốn đặt lại mật khẩu?"
            onConfirm={() => handleResetPassword(record?.id)}
            okText={isLoadingResetPassword ? 'Đang xử lý...' : 'Có, đặt lại mật khẩu'}
            cancelText="Không"
            placement="left"
          >
            <Button type="link" icon={<RedoOutlined />} />
          </Popconfirm>
          <Popconfirm
            title={`Bạn có chắc chắn muốn ${record.is_active ? 'khóa' : 'mở khóa'} tài khoản này?`}
            onConfirm={() => handleLockAccount(record?.id, record?.is_active)}
            okText={isLoadingUpdateUserStatus ? 'Đang xử lý...' : record.is_active ? 'Có, khóa tài khoản' : 'Có, mở khóa tài khoản'}
            cancelText="Không"
            placement="left"
          >
            <Button
              type="link"
              danger={record.is_active}
              icon={<LockOutlined />}
            />
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
      <RoleConfirmModal
        visible={isRoleConfirmModalVisible}
        onConfirm={handleRoleChangeConfirm}
        onCancel={handleRoleChangeCancel}
        record={pendingRoleChange?.record}
        newRole={pendingRoleChange?.role}
        isLoadingUpdateUserRole={isLoadingUpdateUserRole}
      />
      <Modal
        title={'Add User'}
        open={isAddModalVisible}
        onCancel={() => {
          setIsAddModalVisible(false);
          form.resetFields();
        }}
        onOk={handleSubmit}
        okText={isLoadingUser ? 'Đang xử lý...' : 'Create User'}
        centered
        width="40vw"
        bodyStyle={{ maxHeight: '60vh', overflow: 'auto' }}
      >
        <Form layout="vertical" form={form}>
          <div style={{ display: 'flex', gap: 16, marginBottom: 1 }}>
            <Form.Item
              name="email"
              label="Email"
              rules={[
                { required: true, message: 'Please input Email!' },
                {
                  max: 100,
                  message: 'Email must be at most 100 characters!',
                  
                },
                {
                  pattern: /^[A-Za-z0-9._%-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,10}$/,
                  message: 'Please input a valid email!',
                },
              ]}
              style={{ flex: 1 }}
            >
              <Input />
            </Form.Item>
            <Form.Item
              style={{ width: 220 }}
              name="is_active"
              label="Status"
              initialValue={true}
              valuePropName="checked"
              rules={[{ required: true, message: 'Please select Status!' }]}
            >
              <Switch checkedChildren="Active" unCheckedChildren="Inactive" />
            </Form.Item>
          </div>
          <div style={{ display: 'flex', gap: 16, marginBottom: 1 }}>
            <Form.Item
              name="first_name"
              label="First Name"
              rules={[
                { required: true, message: 'Please input First Name!' },
                {
                  max: 50,
                  message: 'First Name must be at most 50 characters!',
                },
              ]}
              style={{ flex: 1 }}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="last_name"
              label="Last Name"
              rules={[
                { required: true, message: 'Please input Last Name!' },
                {
                  max: 50,
                  message: 'Last Name must be at most 50 characters!',
                },
              ]}
              style={{ flex: 1 }}
            >
              <Input />
            </Form.Item>
          </div>
          <div style={{ display: 'flex', gap: 16, marginBottom: 1 }}>
            <Form.Item
              name="gender"
              label="Gender"
              rules={[{ required: true, message: 'Please select Gender!' }]}
              style={{ flex: 1 }}
            >
              <Select>
                <Option value="nam">Nam</Option>
                <Option value="nu">Nữ</Option>
                <Option value="khac">Khác</Option>
              </Select>
            </Form.Item>
            <Form.Item
              name="role"
              label="Role"
              rules={[{ required: true, message: 'Please select Role!' }]}
              style={{ flex: 1 }}
            >
              <Select>
                <Option value="admin">Admin</Option>
                <Option value="editor">Editor</Option>
              </Select>
            </Form.Item>
            {(isLoadingUser) && (
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
              placeholder="Search by username, email, first name or last name"
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
            loading={isLoadingUsers}
            rowKey={(record) => record.id}
            style={{ width: '100%', flex: 1 }}
            size="large"
            pagination={{
              size: 'default',
              total: filteredData?.length || 0,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total) => `Tổng ${total} users`,
            }}
            columns={columns}
            dataSource={filteredData}
          />
        </div>
      </div>
    </>
  );
};

export default User;
