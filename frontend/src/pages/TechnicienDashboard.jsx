// frontend/pages/techniciendashboard.js
import React, { useState, useEffect } from 'react';
import { Layout, List, Card, Typography, Spin, message, Menu, Button } from 'antd';
import { CalendarOutlined, LogoutOutlined } from '@ant-design/icons';
import { useAuth } from '../contexts/AuthContext';
import tasksApi from '../api/tasks';

const { Content, Sider, Header } = Layout;
const { Title, Text } = Typography;

const TechnicienDashboard = () => {
  const { userData, logout } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState('1');

  useEffect(() => {
    const loadTasks = async () => {
      setLoading(true);
      try {
        // Appel à l'API pour récupérer les tâches du technicien connecté
        const response = await tasksApi.getTasksByTechnicien(userData.id);
        setTasks(response.data); // Pas besoin de filtrer, l'API le fait déjà
      }  catch (error) {
        console.error('Erreur de chargement des tâches:', error);
        message.error(`Erreur de chargement des tâches: ${error.message || 'Veuillez réessayer plus tard.'}`);
      } finally {
        setLoading(false);
      }
    };
    loadTasks();
  }, [userData.id]);

  const menuItems = [
    { key: '1', icon: <CalendarOutlined />, label: 'Mes tâches' },
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider collapsible theme="light" width={200}>
        <div className="logo" style={{ padding: 16, textAlign: 'center' }}>
          <Title level={4} style={{ margin: 0 }}>Interface technicien</Title>
        </div>
        <Menu
          theme="light"
          mode="inline"
          selectedKeys={[selectedMenu]}
          items={menuItems}
          onSelect={({ key }) => setSelectedMenu(key)}
        />
        <div style={{ padding: 16, textAlign: 'center', position: 'absolute', bottom: 0, width: '100%' }}>
          <Text strong>{userData?.name}</Text> {/* Affiche le nom du technicien */}
        </div>
      </Sider>
      
      <Layout style={{ padding: '0 24px 24px' }}>
        <Header style={{ background: '#fff', padding: '0 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <Text strong>Connecté en tant que : {userData?.name}</Text>
          </div>
          <Button icon={<LogoutOutlined />} onClick={logout}>Déconnexion</Button>
        </Header>

        <Content style={{ margin: '24px 16px', padding: 24, background: '#fff' }}>
          {loading ? (
            <Spin size="large" style={{ display: 'block', margin: '50px auto' }} />
          ) : (
            <Card title="Mes Tâches" bordered={false}>
              <List
                dataSource={tasks}
                renderItem={task => (
                  <List.Item key={task.id}>
                    <List.Item.Meta
                      title={task.title}
                      description={
                        <>
                          <Text>Statut: {task.status}</Text><br />
                          <Text>Description: {task.description}</Text><br />
                          <Text>Client: {task.client}</Text><br />
                          <Text>Localisation: {task.location}</Text><br />
                        </>
                      }
                    />
                  </List.Item>
                )}
              />
            </Card>
          )}
        </Content>
      </Layout>
    </Layout>
  );
};

export default TechnicienDashboard;