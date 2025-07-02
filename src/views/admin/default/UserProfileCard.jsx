import React from 'react';
import { Avatar, Col, Row, Tag, Typography } from 'antd';
import { EnvironmentOutlined, MailOutlined, PhoneOutlined, UserAddOutlined, UserOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const UserProfileCard = ({ user }) => {
  const {
    username,
    email,
    first_name,
    last_name,
    profile_image,
    gender,
    is_active,
    role,
    created_at,
  } = user;
  
  return (
    <div className="max-w-full mx-auto h-full p-4">
      {/* Avatar */}
      <div className="flex justify-center mb-4">
        <Avatar
          size={150}
          src={profile_image || undefined}
          icon={!profile_image && <UserOutlined />}
        />
      </div>
      
      <div className="text-center mb-5">
        <Title level={3} className="mb-1">
          @{username}
        </Title>
        <Text type="secondary" className="text-lg mb-1">
          {first_name} {last_name}
        </Text>
      </div>
      
      <div className="flex justify-center gap-4 mt-2 mb-4">
        <Text>
          Gender: <strong>{gender}</strong>
        </Text>
        <Text>
          Role: <strong>{role}</strong>
        </Text>
        <Text>
          Status: <Tag color="green">{is_active}</Tag>
        </Text>
      </div>
      
      <Row gutter={[0, 12]} style={{ padding: '1rem' }}>
        <Col span={24}>
          <Text>
            <MailOutlined className="mr-2" />
            Email: <a href={`mailto:${email}`}>{email}</a>
          </Text>
        </Col>
        <Col span={24}>
          <Text>
            <PhoneOutlined className="mr-2" />
            Contact: <span className="text-gray-400">Chưa cập nhật</span>
          </Text>
        </Col>
        <Col span={24}>
          <Text>
            <UserAddOutlined className="mr-2" />
            Ngày tạo:{' '}
            <span className="text-gray-400">
              {created_at
                ? new Date(created_at).toLocaleDateString('vi-VN', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
                })
                : ''}
              {' '}
              (
              {created_at
                ? `${Math.floor(
                  (Date.now() - new Date(created_at)) / (1000 * 60 * 60 * 24),
                )} ngày trước`
                : ''}
              )
            </span>
          </Text>
        </Col>
        <Col span={24}>
          <Text>
            <EnvironmentOutlined className="mr-2" />
            Region: <span className="text-gray-400">Việt Nam</span>
          </Text>
        </Col>
      </Row>
    </div>
  );
};

export default UserProfileCard;
