//frontend /src/pages/GestionnaireDashboard
import React, { useState } from 'react';
import { Layout, Menu, Input, Badge, Avatar, Typography, Button, Card, Popover, List } from 'antd';
import { 
  UserOutlined, 
  CalendarOutlined, 
  FileTextOutlined, 
  UnorderedListOutlined, 
  BellOutlined, 
  SearchOutlined 
} from '@ant-design/icons';
import { useAuth } from '../contexts/AuthContext';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const { Header, Sider, Content } = Layout;
const { Title, Text } = Typography;
const { Search } = Input;
const localizer = momentLocalizer(moment);

const GestionnaireDashboard = () => {
  const { userData, logout } = useAuth();
  const [selectedMenu, setSelectedMenu] = useState('1');
  const [notifications] = useState([
    { id: 1, title: 'Nouveau rapport disponible', date: '2024-03-15' },
    { id: 2, title: 'Tâche échéance demain', date: '2024-03-16' },
  ]);

  const handleLogout = () => logout();

  const menuItems = [
    { key: '1', icon: <CalendarOutlined />, label: 'Calendrier' },
    { key: '2', icon: <FileTextOutlined />, label: 'Rapports' },
    { key: '3', icon: <UnorderedListOutlined />, label: 'Tâches' },
  ];

  const notificationsContent = (
    <List
      dataSource={notifications}
      renderItem={item => (
        <List.Item>
          <List.Item.Meta
            title={item.title}
            description={item.date}
          />
        </List.Item>
      )}
    />
  );

  return (
    <Layout style={{ minHeight: '100vh' }}>
      {/* Sidebar */}
      <Sider collapsible theme="light">
        <div className="logo" style={{ padding: '16px', textAlign: 'center' }}>
          <Title level={4}>Tableau de Bord</Title>
        </div>
        
        <Menu
          theme="light"
          mode="inline"
          selectedKeys={[selectedMenu]}
          items={menuItems}
          onSelect={({ key }) => setSelectedMenu(key)}
        />
      </Sider>

      <Layout>
        {/* Navbar */}
        <Header style={{ 
          background: '#fff', 
          padding: '0 24px', 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center'
        }}>
          <Search
            placeholder="Rechercher..."
            prefix={<SearchOutlined />}
            style={{ width: 300 }}
          />
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <Popover content={notificationsContent} trigger="click">
              <Badge count={notifications.length}>
                <Avatar 
                  icon={<BellOutlined />} 
                  style={{ cursor: 'pointer' }}
                />
              </Badge>
            </Popover>
            
            <Button type="primary" onClick={handleLogout}>
              Déconnexion
            </Button>
          </div>
        </Header>

        {/* Contenu Principal */}
        <Content style={{ margin: '24px 16px', padding: 24, background: '#fff' }}>
          {selectedMenu === '1' && (
            <Calendar
              localizer={localizer}
              events={[]}
              startAccessor="start"
              endAccessor="end"
              style={{ height: 500 }}
              culture="fr"
            />
          )}

          {selectedMenu === '2' && (
            <Card title="Rapports">
              {/* Ajouter votre composant de rapports ici */}
              <p>Contenu des rapports...</p>
            </Card>
          )}

          {selectedMenu === '3' && (
            <Card title="Gestion des Tâches">
              {/* Ajouter votre composant de gestion de tâches ici */}
              <p>Liste des tâches...</p>
            </Card>
          )}
        </Content>
      </Layout>
    </Layout>
  );
};

export default GestionnaireDashboard;

