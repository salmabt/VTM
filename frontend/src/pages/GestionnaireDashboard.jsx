import React from 'react';
import { Button, Card } from 'antd';
import { useAuth } from '../contexts/AuthContext';
import { Avatar, Typography } from 'antd';
import { UserOutlined } from '@ant-design/icons'; // Assure-toi que tu importes cette icône

const GestionnaireDashboard = () => {
  const { userData, logout } = useAuth(); // Récupère userData ici

  const handleLogout = () => {
    logout();
  };

  return (
    <Card className="profile-card">
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
        <Avatar size={150} icon={<UserOutlined />} className="avatar" />
        <Typography.Title level={2} strong className="username">
          {userData.name}        
        </Typography.Title>
        <Typography.Text type="secondary" strong>
          Email: {userData.email}
        </Typography.Text>
        <Typography.Text type="secondary">
          Role: {userData.role}
        </Typography.Text>
        <Button 
          size="large"
          type="primary"
          className="profile-btn"
          onClick={handleLogout}
        >
          Logout
        </Button>
      </div>
    </Card>
  );
};

export default GestionnaireDashboard;

